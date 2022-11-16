import { Component } from "react";
import Like from "./common/like";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/fakeGenreService";
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
  };
  componentDidMount() {
    const genres=[{name:"All Genres"},...getGenres()]
    this.setState({ movies: getMovies(), genres:genres });
  }
  //video 68
  handleLike = (m) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(m);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handlerDelete = (m) => {
    const movies = this.state.movies.filter((i) => i._id !== m._id);
    this.setState({ movies });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre,currentPage:1 });
  };
  render() {
    const { length } = this.state.movies;
    const {
      pageSize,
      currentPage,
      selectedGenre,
      movies: allMovies,
    } = this.state;
    if (length === 0) return <p>There are no movies in database.</p>;
    const filtered = selectedGenre&&selectedGenre._id
      ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
      : allMovies;
    const movies = paginate(filtered, currentPage, pageSize);
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelected={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>Showing {filtered.length} movies in the database</p>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Rate</th>
                <th>like</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.genre.name}</td>
                  <td>{m.numberInStock}</td>
                  <td>{m.dailyRentalRate}</td>
                  <td>
                    <Like liked={m.liked} onLike={() => this.handleLike(m)} />
                  </td>
                  <td>
                    <button
                      onClick={() => this.handlerDelete(m)}
                      className="btn btn-danger btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
