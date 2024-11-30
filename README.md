## Database Diagram
<img src="screenshots/database design.png"/>

## Indexing
I used the following statement to apply indexing for the users table by username
```
CREATE INDEX idx_users_on_username ON "users"(username)
```
And this statement to index articles by title
```
CREATE INDEX idx_articles_on_title ON "articles"(title)
```

After applying indexing there was a big improvement in execution time. This is an example for querying by username from the users table:
#### Before indexing:
<img src="screenshots/Without Indexing.png"/>

#### After indexing:
<img src="screenshots/With Indexing.png"/>

## System Design
### Current system:
<img src="screenshots/current system design.png"/>

### Future system:
Adding load balancers to distrubute traffic will make the system more scalable
<img src="screenshots/future system design.png"/>

## Deployment
Product: https://nestjs-blog-76sz.onrender.com
Staging: https://nestjs-blog-staging.onrender.com

## Testing
### Unit testing user controller:
<img src="screenshots/unit testing user controller.png"/>

### E2E testing:
<img src="screenshots/e2e testing.png"/>
