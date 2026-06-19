from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./quiz.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    """SQLite ignores ON DELETE CASCADE unless foreign keys are enabled per connection."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
