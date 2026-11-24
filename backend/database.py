
import os
import certifi

from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection details
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "nutrisync")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is missing from .env file")

# Create MongoDB client with trusted SSL certificates
client = MongoClient(
    MONGODB_URL,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000
)

# Select database
db = client[DATABASE_NAME]


def check_database_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception as error:
        print("MongoDB connection error:", error)
        return False
