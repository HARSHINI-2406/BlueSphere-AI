import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest

class BlueSpherePredictor:
    def __init__(self):
        self.rf_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
        self._train_models()

    def _train_models(self):
        # Generate synthetic historical data for training
        np.random.seed(42)
        n_samples = 500

        # Features
        sst = np.random.uniform(24.0, 33.0, n_samples)
        chlorophyll = np.random.exponential(scale=1.5, size=n_samples) + 0.1
        salinity = np.random.uniform(30.0, 36.0, n_samples)

        X = pd.DataFrame({
            'sst': sst,
            'chlorophyll': chlorophyll,
            'salinity': salinity
        })

        # Target (fish abundance score: 0 - 100)
        # Optimal SST is around 28°C
        sst_factor = 100 - (sst - 28.0)**2 * 10
        sst_factor = np.clip(sst_factor, 0, 100)

        # Higher chlorophyll means more phytoplankton, hence more fish feed
        chlo_factor = np.clip(chlorophyll * 18, 0, 100)

        # Salinity factor (optimal around 33 PSU)
        sal_factor = 100 - (salinity - 33.0)**2 * 8
        sal_factor = np.clip(sal_factor, 0, 100)

        # Combined target with some noise
        abundance = (0.35 * sst_factor + 0.45 * chlo_factor + 0.20 * sal_factor)
        abundance += np.random.normal(0, 4, n_samples)
        abundance = np.clip(abundance, 0, 100)

        # Train regressor
        self.rf_model.fit(X, abundance)

        # Train IsolationForest anomaly detector
        self.iso_forest.fit(X)

    def predict_abundance(self, sst: float, chlorophyll: float, salinity: float):
        X_pred = pd.DataFrame([[sst, chlorophyll, salinity]], columns=['sst', 'chlorophyll', 'salinity'])
        score = float(self.rf_model.predict(X_pred)[0])
        score = max(0.0, min(100.0, score))

        if score >= 70:
            level = "High"
            rec = "Potential Fishing Zone (PFZ) active. Optimal pelagic fish density. Recommended for purse seine/gillnet operations."
        elif score >= 35:
            level = "Medium"
            rec = "Moderate abundance. Traditional fishing grounds stable. Safe for standard artisanal harvesting."
        else:
            level = "Low"
            rec = "Low abundance warning. Ecosystem stress indicated. Recommend temporary suspension of bottom trawling."

        return score, level, rec

    def detect_anomaly(self, sst: float, chlorophyll: float, salinity: float):
        X_pred = pd.DataFrame([[sst, chlorophyll, salinity]], columns=['sst', 'chlorophyll', 'salinity'])
        # iso_forest returns 1 for inliers, -1 for outliers
        prediction = self.iso_forest.predict(X_pred)[0]
        decision_score = float(self.iso_forest.decision_function(X_pred)[0])
        
        is_anomaly = bool(prediction == -1)
        # Scale score from decision function to range [0, 1] where 1 is highly anomalous
        normalized_score = float(1.0 / (1.0 + np.exp(decision_score * 8)))

        return normalized_score, is_anomaly

# Instantiate single trained predictor instance
predictor = BlueSpherePredictor()
