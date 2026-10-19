"""Generates the illustrated placeholder covers in public/images/.
These are ILLUSTRATIONS, not screenshots. Replace them with real screenshots whenever you like.
Run (optional): python3 scripts/make-placeholder-art.py   (needs Pillow)"""
from PIL import Image, ImageDraw
import os, math
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
PAPER=(245,243,238); PAPER2=(236,233,225); INK=(23,24,28); COBALT=(37,64,217); LINE=(217,213,202); SKY=(142,160,255)
W,H=1600,1000; S=2

def canvas(bg, w=W, h=H, s=S): 
    im=Image.new("RGB",(w*s,h*s),bg); return im, ImageDraw.Draw(im), s
def save(im, name, size, fmt="WEBP"):
    im=im.resize(size, Image.LANCZOS); im.save(os.path.join(OUT,name), fmt, quality=88)

# ---------- BazarDor: price bars + tag + trend line ----------
im,d,s=canvas(PAPER)
for x in range(0,W,100): d.line([(x*s,0),(x*s,H*s)], fill=LINE, width=2)
for y in range(0,H,100): d.line([(0,y*s),(W*s,y*s)], fill=LINE, width=2)
vals=[.34,.46,.40,.58,.52,.70,.62,.82,.74]
bx,bw,gap,base=170,98,38,830
pts=[]
for i,v in enumerate(vals):
    x0=bx+i*(bw+gap); top=base-int(v*560)
    d.rounded_rectangle([x0*s,top*s,(x0+bw)*s,base*s],radius=10*s,fill=COBALT if i==len(vals)-1 else INK)
    pts.append(((x0+bw//2)*s,(top-46)*s))
d.line(pts,fill=COBALT,width=7*s,joint="curve")
for p in pts: d.ellipse([p[0]-11*s,p[1]-11*s,p[0]+11*s,p[1]+11*s],fill=PAPER,outline=COBALT,width=5*s)
d.line([(120*s,base*s),(1480*s,base*s)],fill=INK,width=5*s)
# tag
tx,ty=1120,120
d.polygon([((tx)*s,(ty+60)*s),((tx+70)*s,ty*s),((tx+300)*s,ty*s),((tx+300)*s,(ty+170)*s),((tx+70)*s,(ty+170)*s)],fill=INK)
d.ellipse([(tx+62)*s,(ty+68)*s,(tx+98)*s,(ty+104)*s],fill=PAPER)
for k,wd in enumerate((150,100)): d.rounded_rectangle([(tx+125)*s,(ty+52+k*40)*s,(tx+125+wd)*s,(ty+70+k*40)*s],radius=9*s,fill=PAPER)
save(im,"bazardor-cover.webp",(W,H))

# ---------- Gatekeeper: pixel XOR gate on dark ----------
U=16; gw,gh=W//U,H//U
im=Image.new("RGB",(W,H),INK); d=ImageDraw.Draw(im)
def px(x,y,c,w=1,h=1): d.rectangle([x*U,y*U,(x+w)*U-1,(y+h)*U-1],fill=c)
for x in range(0,gw,5):
    for y in range(0,gh,5): px(x,y,(38,40,48))
cy=gh//2
# gate body (D-shape with concave back for XOR)
x0,x1=38,64; half=11
for y in range(cy-half,cy+half+1):
    t=(y-cy)/half
    front=x1-int(round(abs(t)**2.2*10))
    back=x0+int(round((1-t*t)*4))
    px(back,y,PAPER,max(1,front-back),1)
# second back arc (XOR)
for y in range(cy-half,cy+half+1):
    t=(y-cy)/half; px(x0-4+int(round((1-t*t)*4)),y,SKY,2,1)
# wires
px(8,cy-6,COBALT,30,2); px(8,cy+4,COBALT,30,2)
px(64,cy-1,COBALT,26,2)
# inputs / output nodes
for (x,y) in ((6,cy-7),(6,cy+3)): px(x,y,PAPER,4,4); px(x+1,y+1,COBALT,2,2)
px(90,cy-2,PAPER,4,4); px(91,cy-1,SKY,2,2)
# step circuit below
px(10,cy+16,COBALT,2,12); px(10,cy+28,COBALT,22,2); px(32,cy+18,COBALT,2,12); px(32,cy+18,COBALT,16,2); px(48,cy+18,COBALT,2,10)
# flag/key pixel-art top right
for (x,y,w,h,c) in ((76,6,8,8,PAPER),(78,8,4,4,INK),(84,9,10,2,PAPER),(90,11,2,3,PAPER),(86,11,2,3,PAPER)): px(x,y,c,w,h)
im.save(os.path.join(OUT,"gatekeeper-cover.webp"),"WEBP",quality=90)

# ---------- XOR Café: controller + cup + XOR mark ----------
im,d,s=canvas(COBALT)
for x in range(0,W,100): d.line([(x*s,0),(x*s,H*s)], fill=(60,86,232), width=2)
for y in range(0,H,100): d.line([(0,y*s),(W*s,y*s)], fill=(60,86,232), width=2)
def R(b,**k): d.rounded_rectangle([v*s for v in b],**k)
def C(cx,cy,r,**k): d.ellipse([(cx-r)*s,(cy-r)*s,(cx+r)*s,(cy+r)*s],**k)
# controller
R([330,380,1010,700],radius=150,fill=PAPER)
C(400,640,150,fill=PAPER); C(940,640,150,fill=PAPER)
R([470,455,540,605],radius=14,fill=INK); R([430,495,580,565],radius=14,fill=INK)   # dpad
C(800,500,24,fill=INK); C(870,540,24,fill=INK); C(800,580,24,fill=INK); C(730,540,24,fill=INK)
C(560,625,42,outline=INK,width=8*s); C(790,625,42,outline=INK,width=8*s)
R([620,470,720,490],radius=10,fill=INK)
# cup with steam
R([1150,520,1350,720],radius=36,fill=PAPER); d.arc([1320*s,550*s,1440*s,670*s],270,90,fill=PAPER,width=22*s)
R([1130,730,1370,760],radius=15,fill=INK)
for k,xx in enumerate((1210,1260,1310)):
    R([xx-6,400+(k%2)*24,xx+6,480+(k%2)*24],radius=6,fill=SKY)
# XOR mark
C(1230,250,70,outline=PAPER,width=12*s); d.line([(1230-70)*s,250*s,(1230+70)*s,250*s],fill=PAPER,width=12*s); d.line([1230*s,(250-70)*s,1230*s,(250+70)*s],fill=PAPER,width=12*s)
save(im,"xor-cafe-cover.webp",(W,H))

# ---------- Open Graph card (PNG for broad crawler support) ----------
im,d,s=canvas(PAPER,1200,630,2)
for x in range(0,1200,100): d.line([(x*s,0),(x*s,630*s)], fill=LINE, width=2)
R2=lambda b,**k: d.rounded_rectangle([v*s for v in b],**k)
R2([90,120,200,230],radius=26,fill=COBALT)
# monogram R
d.rectangle([128*s,150*s,144*s,200*s],fill=PAPER); d.arc([126*s,148*s,176*s,184*s],270,90,fill=PAPER,width=14*s); d.line([(144*s,182*s),(176*s,202*s)],fill=PAPER,width=14*s)
im=im.resize((1200,630),Image.LANCZOS); im.save(os.path.join(OUT,"rezwan-ahmed-og.png"),"PNG")
print("ok")
