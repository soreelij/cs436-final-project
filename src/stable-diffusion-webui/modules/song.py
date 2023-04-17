import modules.scripts

def song(prompt: str):
    p = SongProcessing(prompt=prompt)
    
    p.scripts = modules.scripts.scripts_song
    p.script_args = args
    
    processed = modules.scripts.scripts_txt2img.run(p, *args)
    
    return processed.returnTitle()
