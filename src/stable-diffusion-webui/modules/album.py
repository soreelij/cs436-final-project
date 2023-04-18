# models.py in api
# in api.py define the actual method ex. get_song()
# moduesl scripts add skript files
import modules.scripts

def album(prompt: str):
    p = AlbumProcessing(prompt=prompt)
    
    p.scripts = modules.scripts.scripts_album
    p.script_args = args
    
    processed = modules.scripts.scripts_txt2img.run(p, *args)
