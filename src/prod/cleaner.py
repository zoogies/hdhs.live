# using this post website takdown to clean bad content before backing it up
"""
postids = [
    714,
    713,
    712,
    711,
    709,
    708,
    704,
    697,
    695,
    691,
    690,
    689,
    688,
    687,
    685,
    684,
    678,
    629,
    625,
    622,
    619,
    618,
    597,
    596,
    594,
    593,
    575,
    571,
    537,
    524,
    459,
    453,
    416,
    360,
]
"""
import os

# posts = []

# for id in postids:
#    attachment = query_db('SELECT attachmentid FROM "main" WHERE id=' + str(id))
#    posts.append(attachment)
#    print("found root id for", id, "as", attachment)

posts = [
    275,
    274,
    273,
    271,
    272,
    270,
    269,
    265,
    262,
    261,
    257,
    256,
    255,
    254,
    253,
    252,
    251,
    245,
    223,
    219,
    216,
    214,
    213,
    196,
    195,
    194,
    193,
    184,
    182,
    156,
    147,
    116,
    112,
    87,
    63,
    263,
    257,
]

for post in posts:
    print("looking for", post)
    path = "src/prod/static/attachments/" + str(post) + ".jpeg"
    thumb = "src/prod/static/attachments/previews" + str(post) + ".jpeg"
    if os.path.exists(path):
        os.remove(path)
        print("removed", path)
        with open(
            "src/prod/static/attachments/" + str(post) + ".deletedpost", "w"
        ) as fp:
            print("wrote replacement", path)
            pass
    if os.path.exists(thumb):
        os.remove(thumb)
        print("removed", thumb)
        with open(
            "src/prod/static/attachments/previews" + str(post) + ".deletedpost", "w"
        ) as fp:
            print("wrote replacement", thumb)
            pass
