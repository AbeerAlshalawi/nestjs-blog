## Database Diagram
<img src="/DB Diagram.png"/>

## Indexing
I used the following query to apply indexing for the users table by username
```
CREATE INDEX idx_users_on_username ON "users"(username)
```
And this command to apply it on the articles table to index articles by title
```
CREATE INDEX idx_articles_on_title ON "articles"(title)
```

After applying indexing there was a big improvement in the executing time. This is an example for querying by username from the users table:
#### Before indexing:
<img src="/Without Indexing.png"/>

#### After indexing:
<img src="/With Indexing.png"/>
