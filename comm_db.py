import pandas as pd
import psycopg2
import pandas.io.sql as psql
import time
import cred

# def create_conn():
#     conn = psycopg2.connect(host="localhost",
#                             user="",
#                             password="",
#                             port=0000,
#                             dbname="")
#
#     return conn

inf_schema_details_table = 'information_schema.columns'

movie_table = 'mywatchtogether.movie_master'
rel_table = 'mywatchtogether.control_movie'


def get_movie_details(m_id):
    q_string = f"""select m_name, m_dir, loc, rated, description, m_year, genre, poster from {movie_table} where 
    movie_id = {m_id} limit 1;"""
    conn = cred.create_conn()
    cursor = conn.cursor()
    cursor.execute(q_string)
    res = cursor.fetchone()

    poster = res[7]
    if poster == None:
        poster = "https://img.freepik.com/free-psd/neon-vertical-flyer-electronic-music-with-female-dj_23-2148979675.jpg"

    cursor.close()
    conn.close()
    m_detail_dict = {
        'movie_name': str(res[0]).capitalize(),
        'm_dir': str(res[1]),
        'loc': str(res[2]),
        'rated': str(res[3]),
        'description': str(res[4]),
        'm_year': str(res[5]),
        'genre': str(res[6]),
        'poster': poster
    }
    return m_detail_dict


def get_movie_id(m_name):
    q_string = f"""select movie_id from {movie_table} where lower(m_name) like lower('%{m_name}%') limit 1;"""
    conn = cred.create_conn()
    cursor = conn.cursor()
    cursor.execute(q_string)
    res = cursor.fetchone()

    if res == None:
        try:
            import requests
            api_key = cred.api_key
            get_url = 'https://www.omdbapi.com/?t=' + m_name + '&apikey=' + api_key
            response = requests.get(get_url)
            new_response_dict = response.json()
            if response.status_code == 200:
                insert_new_data_query = f"""insert into {movie_table}
                (m_name, genre, rated, description, m_year, imdb_id, poster) 
                values('{new_response_dict['Title']}', '{new_response_dict['Genre']}', 
                '{new_response_dict['Rated']}', '{new_response_dict['Plot']}', 
                '{new_response_dict['Year']}', '{new_response_dict['imdbID']}',
                '{new_response_dict['Poster']}')"""
                print('New Data added to the Movie Master!')
                # print(insert_new_data_query)

                cursor.execute(insert_new_data_query)
                conn.commit()
                cursor.execute(q_string)
                res = cursor.fetchone()

        except Exception as e:
            return str(e)

        finally:
            cursor.close()
            conn.close()

    res_dict = {
        'movie_id': str(res[0]),
    }

    return res_dict


# print(get_movie_id('dhoom 3'))

def fetch_db(movie_id, session):
    q_string = f"""select is_playing, is_bar_dragged, cur_time from {rel_table} 
    where movie_id='{movie_id}' and current_session = '{session}' limit 1;"""
    conn = cred.create_conn()
    cursor = conn.cursor()
    cursor.execute(q_string)
    res = cursor.fetchone()
    cursor.close()
    conn.close()

    control_dict = {
        'is_playing': str(res[0]),
        'is_bar_dragged': str(res[1]),
        'cur_time': str(res[2])
    }

    return control_dict


def set_db(movie_id, var_is_playing, var_is_bar_dragged, var_cur_time, session):
    if session:
        q_string = f"""update {rel_table} set is_playing = {var_is_playing}, 
        cur_time = '{var_cur_time}', is_bar_dragged = {var_is_bar_dragged}
        where movie_id = '{movie_id}' and current_session = '{session}'"""
        # print(q_string)
    else:
        session = str(time.time()).replace('.', '')
        q_string = f"""insert into {rel_table} (movie_id, is_playing, cur_time, current_session) 
        values ('{movie_id}', {var_is_playing}, '{var_cur_time}', '{session}')"""
        # print(q_string)

    conn = cred.create_conn()
    cursor = conn.cursor()
    cursor.execute(q_string)
    conn.commit()
    cursor.close()
    conn.close()

    return session


def join_session(session):
    session = session.split('/')[-1]
    print('Session: ', session)
    if session is not None:
        if len(session) > 3:
            q_string = f"""select movie_id from  {rel_table} where current_session = '{session}' limit 1"""
            conn = cred.create_conn()
            cursor = conn.cursor()
            cursor.execute(q_string)
            m_id = cursor.fetchone()[0]
            if m_id is not None:
                part_url = str(m_id)+'/'+str(session)
                return part_url

def join_party_info(session):
    m_id = join_session(session).split('/')[0]
    m_detail_dict = get_movie_details(m_id)
    return m_detail_dict

# print(join_party_info('1692472005016427'))








