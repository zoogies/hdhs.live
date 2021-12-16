import ffmpeg

file = "29.mp4"
width = ffmpeg.probe(file)["streams"][0]["width"]

# Set how many spots you want to extract a video from.
ffmpeg.input(file, ss=0).filter("scale", width, -1).output("/static/attachments/previews/test.jpg", vframes=1).run()
