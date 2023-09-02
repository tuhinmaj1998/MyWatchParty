# WatchMyShow

```Author: TUHIN MAJUMDER```<br>
```Last Update: Sept 2023```

---

Welcome to WatchmyShow Repository. Currently it's hosted from 
[Render.com](https://render.com) on 
[watchmyshow.tuhinmajumder.com](https://watchmyshow.tuhinmajumder.com). 



WatchMyShow is a Flask-based web application that allows users to
watch and control shows or videos together in a synchronized manner. 
Inspired by platforms like WatchTogether and Amazon Prime Watch Party, 
this project enables users to create sessions, invite friends, 
and enjoy content simultaneously.

## Features

- **Synchronized Viewing**: Users can watch shows or videos together 
- in real-time, ensuring a synchronized viewing experience.

- **Create Sessions**: Users have the ability to create new viewing sessions and host their own gatherings.

- **Invite Friends**: Share session links with friends, allowing them to join the session and enjoy content together.

- **User Control**: Users can take control of playback, pause, play, and seek within the video.

- **Database**: The project uses PostgreSQL to store session information and user data securely.

   
## Usage

- Create a new session or join an existing one.

- Share the session link with friends to invite them.

- Enjoy synchronized viewing and control over the content.
- 
## Getting Started

### Prerequisites

Before getting started, ensure you have the following prerequisites:

- Python
- Flask
- PostgreSQL
- Any necessary Python libraries (specified in requirements.txt)

### Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/tuhinmaj1998/MyWatchParty.git

2. Create a virtual environment:
    ```shell
   python -m venv venv
   ```
3. Activate the virtual environment:
    ```shell
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

4. Install Dependencies:
    ```shell
   pip install -r requirements.txt
   ```

5. Create Database in PostgreSQL.
   1. Create schema
    ~~~~sql
    CREATE SCHEMA IF NOT EXISTS mywatchtogether;
    ~~~~
   2. Create movie_master table under the schema.
   ~~~~sql
   CREATE TABLE IF NOT EXISTS mywatchtogether.movie_master(
    movie_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    m_name character varying(100) COLLATE pg_catalog."default",
    loc character varying(1000) COLLATE pg_catalog."default",
    m_size numeric(10,3),
    genre character varying(100) COLLATE pg_catalog."default",
    m_dir character varying(100) COLLATE pg_catalog."default",
    rated character varying(50) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default",
    m_year character varying(50) COLLATE pg_catalog."default",
    director character varying(50) COLLATE pg_catalog."default",
    poster character varying(500) COLLATE pg_catalog."default",
    imdb_id character varying(50) COLLATE pg_catalog."default");
    ~~~~
   3. Create control_movie table too.
   ~~~~sql
   CREATE TABLE IF NOT EXISTS mywatchtogether.control_movie(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    movie_id character varying(100) COLLATE pg_catalog."default",
    current_session character varying(100) COLLATE pg_catalog."default",
    is_playing boolean,
    cur_time character varying(50) COLLATE pg_catalog."default",
    is_bar_dragged boolean
   );
   ~~~~
   4. Create user_session table.
   ~~~~sql
   CREATE TABLE IF NOT EXISTS mywatchtogether.user_session(
    user_sid integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    ip character varying(20) COLLATE pg_catalog."default",
    user_name character varying(100) COLLATE pg_catalog."default",
    session_id character varying(100) COLLATE pg_catalog."default",
    created_time character varying(50) COLLATE pg_catalog."default"
   );
   ~~~~
   5. Since for testing purspose I have already put some video files
    in static folder to make it ready for functional testing. All you need
   is to add the corresponding data into your movie_master table.
   ~~~~sql
   INSERT INTO mywatchtogether.movie_master(
   m_name, loc, genre, m_dir, rated, description)
   VALUES
      ('Earth', 'Earth.mov','Sample','mymovies','Not Rated','This is a sample video of earth'),
      ('Beach', 'Beach.mov','Sample','mymovies','Not Rated','This is a sample video of Beach');
   ~~~~
6. Create an account in [omdbapi.com](https://www.omdbapi.com/) and add an API Key for better search feature.
   Note that in free subscription, you have limit of 1000 daily.

7. Setup your environment variables.
      <table>
      <tr>
      <th>Environment Variable</th>
      <th>Description</th>
      </tr>
      <tr>
      <td>Database</td>
      <td>Your DBName</td>
      </tr>
      <tr>
      <td>Host</td>
      <td>Your DB Host</td>
      </tr>
      <tr>
      <td>Username</td>
      <td>Your DB Username</td>
      </tr>
      <tr>
      <td>Password</td>
      <td>Add your DB Password</td>
      </tr>
      <tr>
      <td>Port</td>
      <td>Your DB Port Number in Integer</td>
      </tr>
      <tr>
      <td>Secret_key</td>
      <td>For Flask security</td>
      </tr>
      <tr>
      <td>api_key</td>
      <td>Your omdbapi Key</td>
      </tr>
   </table>

8. Run Flask:
    ```shell
   flask run
    ```


## Acknowledgement

Inspiration from [Watch2gether](https://w2g.tv/en/) and [Amazon Prime Watch Party](https://www.primevideo.com/help?nodeId=GLPK9QXFP2NAQDPV) for synchronized viewing.