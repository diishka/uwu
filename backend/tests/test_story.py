from app.seed import D, E, R
from app.diary import ENTRIES

def test_graph_is_valid_and_reachable():
    ids = [d[0] for d in D]; assert ids == list(range(1, 18))
    assert R == "YOUWEREALWAYSHERE" and len(R) == 17
    req = {d[0]: d[5] for d in D}; reached = set()
    while len(reached) < 17:
        new = {i for i, r in req.items() if i not in reached and (r is None or r in reached)}
        assert new, "unreachable secrets / cycle"; reached |= new

def test_not_a_straight_line_and_answers_unique():
    roots = [d for d in D if d[5] is None]; assert len(roots) >= 3
    assert len({d[1] for d in D}) == 17

def test_diary_gap_and_events():
    ids = [e[0] for e in ENTRIES]; assert "047" in ids and "048" not in ids and "???" in ids
    assert {e[2] for e in E} == {"secrets", "visitors"}
