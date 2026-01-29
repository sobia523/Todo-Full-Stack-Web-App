import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from src.auth.utils import create_access_token, verify_token
from src.config import settings
import uuid

print(f"Secret: {settings.better_auth_secret}")
print(f"Algorithm: HS256")

user_id = uuid.uuid4()
email = "test@example.com"
name = "Test User"

data = {"sub": str(user_id), "user_email": email, "user_name": name}
print(f"Data to encode: {data}")

token = create_access_token(data)
print(f"Generated Token: {token}")

decoded = verify_token(token)
print(f"Decoded: {decoded}")

if decoded:
    print("Verification SUCCESS")
else:
    print("Verification FAILED")
