# API DOCUMENTATION

route signin and signup
| Route                 |  HTTP  | Desription                                           |
| --------------------- |:------:| ---------------------------------------------------- |
| /signup               | POST   | body: name, email, password                          |
| /signin               | POST   | body: email, password                                |

List of route Post
| Route                 |  HTTP  | Desription                                           |
| --------------------- |:------:| ---------------------------------------------------- |
| /post                 | POST   | headers: token, body: title, description             |
| /post                 | GET    | Get all Post or Question                             |
| /post/my-post         | GET    | headers: token, Get All Your Post or Question        |
| /post/upvote          | PATCH  | headers: token, body: postId                         |
| /post/downvote        | PATCH  | headers: token, body: postId                         |
| /post/:id             | GET    | Get Specific Post Or Question                        |
| /post/:id-Post        | PUT    | headers: token, body: title, description             |
| /post/:id-Post        | DELETE | headers: token, body: title, description             |

List of route Reply
| Route                 |  HTTP  | Desription                                           |
| --------------------- |:------:| ---------------------------------------------------- |
| /reply                | POST   | headers: token, body: body                           |
| /reply                | PUT    | headers: token, body: body                           |
| /reply/upvote         | PATCH  | headers: token, body: replyId                        |
| /reply/downvote       | PATCH  | headers: token, body: replyId                        |