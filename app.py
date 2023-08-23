from flask import Flask, render_template, request, json, jsonify, redirect, url_for
import comm_db
from flask_httpauth import HTTPBasicAuth
from flask_ngrok import run_with_ngrok
import cred

app = Flask(__name__)
app.config.update(dict(
    PREFERRED_URL_SCHEME='https'
))
app.config['SECRET_KEY'] = cred.secret_key


# run_with_ngrok(app)
# auth = HTTPBasicAuth()
# our_cred = {'watch':'1234'}

@app.route('/')
def index():
    return render_template('index.html')
    # return 'hello World!'


@app.route('/search/<movie_name>/')
def search_movie(movie_name):
    print(movie_name)
    try:
        search_m_id = comm_db.get_movie_id(movie_name)
        print(search_m_id)
        session = comm_db.set_db(search_m_id['movie_id'], True, False, '00:00', None)
        print('session: ', session)
        # return redirect(f"/{movie_name}/{m_dict['m_dir']}/{m_dict['loc']}/{m_dict['movie_id']}/{session}")
        return redirect(f"/{search_m_id['movie_id']}/{session}")
    except Exception as e:
        return f'Does not exist!\nError: {str(e)}'


@app.route('/<m_id>/<session>')
def watch_movie(m_id, session):
    print('Watch movie session: ', session)
    current_mDetails_dict = comm_db.get_movie_details(m_id)

    return render_template('movie.html',
                           videofilename=f'{current_mDetails_dict["m_dir"]}/{current_mDetails_dict["loc"]}',
                           movie_id=m_id, session=session, movie_name=current_mDetails_dict["movie_name"],
                           rated=current_mDetails_dict['rated'], description=current_mDetails_dict['description'],
                           genre=current_mDetails_dict['genre'], m_year=current_mDetails_dict['m_year'],
                           poster=current_mDetails_dict['poster'], )


@app.route('/set_db/<movie_id>/<is_playing>/<is_bar_dragged>/<curr_time>/<session>')
def app_set_db(movie_id, is_playing, is_bar_dragged, curr_time, session):
    my_session = comm_db.set_db(movie_id, is_playing, is_bar_dragged, curr_time, session)
    return my_session


@app.route('/fetch_db/<movie_id>/<session>')
def app_fetch_db(movie_id, session):
    control_dict = comm_db.fetch_db(movie_id, session)

    return jsonify({'control_dict': control_dict})


@app.route('/join/<session>')
def join_session(session):
    part_url = comm_db.join_session(session)
    return part_url


@app.route('/joininfo/<session>')
def joininfo(session):
    if session is not None:
        if len(session) > 6:
            current_mDetails_dict = comm_db.join_party_info(session)
            return jsonify(current_mDetails_dict)

            # return render_template('index.html', movie_name=current_mDetails_dict["movie_name"],
            #                        rated=current_mDetails_dict['rated'],
            #                        description=current_mDetails_dict['description'],
            #                        genre=current_mDetails_dict['genre'], m_year=current_mDetails_dict['m_year'],
            #                        poster=current_mDetails_dict['poster'])


if __name__ == '__main__':
    app.run(debug=True, port=7500)
    # app.run()
