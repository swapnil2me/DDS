import numpy as np
import pandas as pd
from random import randint as rit
from datetime import datetime as dt
import matplotlib.pyplot as plt
dt.now()
dt.now().strftime("%x")

states = ['MH','GJ','KA','TN','UP','DL','RJ','MP','WB','GOA']

sateMax = {'MH':300,'GJ':250,'KA':200,'TN':220,'UP':300,'DL':150,'RJ':120,'MP':200,'WB':180,'GOA':100}
timeline=[]

for j in range(2010,2021):
    for i in range(12):
        timeline.append('{:02d}/1/{}'.format(i%12+1,j))

stateCol = []
timelineCol = []

for i in states:
    for j in timeline:
        stateCol.append(i)

for i in states:
    for j in timeline:
        timelineCol.append(j)

rintvl1 = (-100,0)
rintvl2 = (10,30)


p1 = []

for j in states:
    for i in range(len(timeline)):
        if i<len(timeline)/1.5:
            vp = rit(*rintvl2)
        else:
            vp = rit(*rintvl1)

        p1coeff = np.log(sateMax.get(j))/132
        p1.append(int(np.abs(np.exp(p1coeff*(i+1))+vp)))



p2 = []
rintvl1 = (-30,0)
rintvl2 = (5,50)
for j in states:
    for i in range(len(timeline)):
        if i<len(timeline)/1.9:
            vp = rit(*rintvl2)
        else:
            vp = rit(*(rit(-15,-5),rit(-5,10)))
        p2coeff = sateMax.get(j)
        p2.append(int(np.abs(p2coeff*rit(*(10,20))/20*(1-np.cos(i*np.pi/132.0/2.0))+vp)))



p3 = []
rintvl1 = (-30,0)
rintvl2 = (0,30)
for j in states:
    for i in range(len(timeline)):
        if i<len(timeline)/1.9:
            vp = rit(*rintvl2)
        else:
            vp = rit(*(rit(-15,-5),rit(-5,10)))
        p3coeff = sateMax.get(j)
        p3.append(int(np.abs(p3coeff*rit(*(10,15))/15*(np.cos(i*np.pi/132.0/2.0))+vp)))

dataDict={"STATES":stateCol,"month":timelineCol,"P1":p1,"P2":p2,"P3":p3}
swap=pd.DataFrame(dataDict)


swap.to_csv("swap.tsv",index=False,sep="\t")

myDit = [{"State":i, "freq":{"low":swap[swap.STATES==i].P1.sum(),
                         "mid":swap[swap.STATES==i].P2.sum(),
                         "high":swap[swap.STATES==i].P3.sum(),
                        }} for i in states]

with open("freqData.txt","w") as f:
    print(myDit,file=f)
