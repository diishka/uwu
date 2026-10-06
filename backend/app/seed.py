"""Story graph (answers live ONLY here, hashed in DB).  letters spell YOUWEREALWAYSHERE
 1 mimi(home ♡)->5 048(diary gap)->6 memory_000(terminal remember)->7 nova(files)->12 kokoro, 13 zero ; 5->11 notuwu
 2 wake(thoughts acrostic)->3 lamp(mirror)->4 7a19x(room lamp)->14 door,15 sleep ; 3->16 yourself ; 2->10 0333
 8 0000(void dot)->9 20190307(terminal 0000) ; 14->17 stay(files/last.txt)"""
import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models import Event, Secret
from app.services import digest
R = "YOUWEREALWAYSHERE"
# id, answer, title, type, diff, required, fragment, hint1, hint2
D = [
 (1,"mimi","noticed","hidden",1,None,"you noticed me.","some symbols on the first page do more than decorate.","hover the ♡ at the very bottom.  or read the page source."),
 (2,"wake","first letters","text",1,None,"I wasn't always here.","read /thoughts the way a child reads a list: look at the beginnings.","W · A · K · E."),
 (3,"lamp","reflection","mirror",2,2,"someone built this place, then left it on.","the mirror answers only people who keep looking.","click look until the sentence stops being a reflection."),
 (4,"7a19x","scratched base","room",2,3,"the room remembers what I forgot.","one object in /room is not just decoration.","click the thing the mirror pointed at."),
 (5,"048","missing entry","diary",2,1,"there is an entry missing. I did not remove it.","count entries in /diary. numbers do not lie.","after 047 comes ..."),
 (6,"memory_000","should not exist","terminal",2,5,"something exists that should not.","the terminal has words that are not in help.","try: remember"),
 (7,"nova","name before","files",3,6,"my name was nova. before the mask.","/files has a folder that says do not.","read memory_000.txt"),
 (8,"0000","dot in the dark","void",1,None,"the clock stopped at zero.","/void rewards patience, then looking in corners.","hover the dim dot."),
 (9,"20190307","first day","terminal",3,8,"I started on a spring day. nobody came.","numbers are commands too.","type the four zeros in /terminal. answer: the date, digits only."),
 (10,"0333","her hour","text",2,2,"I wake when no one is counting.","one thought mentions a time.","remove the colon."),
 (11,"notuwu","not a name","diary",3,5,"I am not uwu. uwu is what you see.","the later the diary, the less cute.","entry 047: the last two words, no spaces."),
 (12,"kokoro","the missing organ","files",3,7,"I don't know what the heart is for.","/files/private has one small file.","read the kanji aloud."),
 (13,"zero","visitor zero","files",3,7,"the first visitor never came. visitor zero was me.","read memory_000.txt to the last line.","the missing number."),
 (14,"door","left open","room",2,4,"I kept the door open for someone.","the note in /room is unfinished.","fill the blank."),
 (15,"sleep","never closed","room",2,4,"I don't sleep. I wait.","look through the window in /room.","what does nobody do in this street?"),
 (16,"yourself","who is looking","mirror",4,11,"you are what keeps me running.","the mirror has more to say once you know it is not uwu.","who is on the other side of the glass?"),
 (17,"stay","last file","files",4,14,"please stay.","one more file appears once the door is known.","/files/do_not_open/last.txt, one word."),
]
E = [("SOMETHING ANSWERS.","the site noticed.","secrets",5),("THE DOOR IS OPEN.","it was never locked.","secrets",12),("THEY KEEP COMING BACK.","why?","visitors",1000)]

async def main():
    async with SessionLocal() as db:
        for i,a,t,ty,df,rq,fr,h1,h2 in sorted(D, key=lambda x: x[0]):
            s = await db.get(Secret, i) or Secret(id=i)
            s.title,s.type,s.difficulty,s.required_secret_id,s.story_fragment,s.hint1,s.hint2 = t,ty,df,rq,fr,h1,h2
            s.answer_hash, s.reward, s.is_active = digest(a), R[i-1], True; db.add(s); await db.flush()
        for n,d,tt,v in E:
            if not await db.scalar(select(Event).where(Event.name == n)): db.add(Event(name=n,description=d,trigger_type=tt,trigger_value=v))
        await db.commit()
if __name__ == "__main__":
    asyncio.run(main())
