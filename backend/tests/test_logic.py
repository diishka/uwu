from fastapi.testclient import TestClient
from app.main import app
from app.services import digest, norm

def test_norm_and_hash():
    assert norm("03:33") == "0333" and norm(" Mimi! ") == "mimi"
    assert digest("MIMI") == digest("mimi") and digest("a") != digest("b")

def test_health_and_body_limit():
    c = TestClient(app)
    assert c.get("/api/health").json() == {"ok": True}
    assert c.post("/api/final/solve", content="x" * 3000, headers={"content-type": "application/json"}).status_code == 413
