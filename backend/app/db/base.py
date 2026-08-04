# Import all the models so that Base.metadata has them loaded before creating tables
from app.db.session import Base # noqa
from app.models.region import Region # noqa
from app.models.ocean import OceanObservation # noqa
from app.models.fisheries import FisheriesRecord # noqa
from app.models.biodiversity import BiodiversityRecord # noqa
from app.models.insights import AIInsight # noqa
from app.models.user import User # noqa
