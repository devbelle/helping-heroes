use helpingheroes_db;

-- list all posts along with the poster and the date created
-- this might emulate the content of the home page

SELECT
  p.title,
  u.username,
  CONCAT(MONTH(p.created_at), '/', DAYOFMONTH(p.created_at), '/', YEAR(p.created_at)) AS created_date
FROM
  post p
  JOIN USER u ON p.user_id = u.id;

-- list all responses for each post along with the poster username and response username
-- this might emulate what might happen when a logged-in user clicks on a post title

SELECT
  p.id,
  p.title,
  p.`content`,
  CONCAT(MONTH(p.created_at), '/', DAYOFMONTH(p.created_at), '/', YEAR(p.created_at)) AS posted_date,
  u.username AS post_by,
  r.`content`,
  r.user_id,
  u2.username,
  CONCAT(MONTH(r.created_at), '/', DAYOFMONTH(r.created_at), '/', YEAR(r.created_at)) AS response_date
FROM
  response r
  JOIN post p ON r.post_id = p.id
  JOIN `user` u ON p.user_id = u.id
  JOIN `user` u2 ON r.user_id = u2.id
ORDER BY
  p.id;

-- List all the tags on each post
-- this would be needed for filtering posts by tag on the home page

SELECT
  p.id,
  p.title,
  t.`name`
FROM
  tag t
  JOIN tagpost tp ON t.id = tp.tag_id
  JOIN post p ON tp.post_id = p.id
ORDER BY
  p.id;

-- count the number of upvotes by response and sort in descending order
-- this is across ALL posts but in the app we would want to restrict it to the responses to a give post (and then sort response by upvotes)
-- this is more proof of concept to make sure the tables are structured property

SELECT
  r.id,
  r.`content`,
  COUNT(*) AS num_upvotes
FROM
  response r
  JOIN userupvote up ON r.id = up.response_id
GROUP BY
  r.id
ORDER BY
  num_upvotes DESC;

-- verify that a user cannot upvote the same post more than once
-- run the code below twice, you should get an error on the second time
-- (or possibly the first if the combo already exists)

INSERT INTO userupvote
    VALUES(1, 1);

-- verify that a user cannot duplicate a tag on a post
-- run the code below twice, you should get an error on the second time
-- (or possibly the first if the combo already exists)

INSERT INTO tagpost
    VALUES(1, 1);
