import os,sys,json,base64,urllib.request,urllib.error
root,name,tokvar=sys.argv[1:4]; T=os.environ[tokvar]
EX={"node_modules",".git",".next",".vercel"}; files=[]
for dp,dn,fn in os.walk(root):
    dn[:]=[x for x in dn if x not in EX]
    for f in fn:
        if f.startswith(".env"): continue
        p=os.path.join(dp,f)
        files.append({"file":os.path.relpath(p,root),"data":base64.b64encode(open(p,"rb").read()).decode(),"encoding":"base64"})
body={"name":name,"target":"production","files":files,"projectSettings":{"framework":None,"buildCommand":"","outputDirectory":"","installCommand":""}}
r=urllib.request.Request("https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1",data=json.dumps(body).encode(),headers={"Authorization":"Bearer "+T,"Content-Type":"application/json"},method="POST")
try: d=json.load(urllib.request.urlopen(r,timeout=50))
except urllib.error.HTTPError as e: print("ERR",e.code,e.read().decode()[:400]); sys.exit(1)
print(json.dumps({k:d.get(k) for k in ["id","url","readyState","alias"]}))
