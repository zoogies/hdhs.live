# API DOCUMENTATION

## Content Retrieval:

- `/fetchreports` (0 arguments)
    - returns a json response of lists which contain all existing rows in the report table

- `/fetchnumreps` (0 arguments)
    - returns an integer wrapped in a json response of the length of the reports table

- `/fetchposts` (order,start,numloaded)
    - returns the next 15 posts in the order passed, starting at the point passed

- `/commentsnew` (id)
    - returns a list of all comments attached to the given post id

- `/fetchallcomments` (0 arguments)
    - returns every single comment in a json list of lists (for use on admin facing side)

- `/numcomments` (id)
    - returns an int of the number of comments for a given post id   

- `/getattachment` (0 arguments)
    - returns the entire attachment table in a json which is then saved locally for future reference


## Content Interaction:

- `/moderate` (type, action, id)
    -  deletes dismisses or sets no render the post id or comment id specified with "id" and "type". returns "ok" if successful or "bad" if it fails.

- `/report` (id, reason, type)
    - TODO DOCS

- `/comment` (post,content,user)
    - TODO DOCS

- `/laugh` (type, id)
    - TODO DOCS

- `/post` (user, content)
    - TODO DOCS

- `/postimage` (user, text, file)
    - TODO DOCS


## Misc:

- `/auth` (password)
    - checks the provided password with the local server password in secretkey.txt and returns "true" or "false" if it matches