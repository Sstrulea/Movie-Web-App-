import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingHandler } from './loading-handler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  genre: any[] = [];
  movies: any[] = [];
  genresSelected: any[] = [];
  genredListed: any[] = [];
  isCollapsed: boolean = true;
  timeout: any = null;
  favouriteSection: any[] = [];
  isLoading: boolean = false;
  LoadingHandler = new LoadingHandler();
  lastUrl: string = '';
  currentPage: number = 0;
  nextPage: number = 0;
  prevPage: number = 0;
  totalPages: number = 0;

  totalLength: any;
  page: number = 1;

  filterGenre() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    this.getGenre();
    this.getMovies(
      `https://api.themoviedb.org/3/movie/popular?api_key=efbfeb5743f349d94c1b2d862344373f`
    );
  }

  //Luam categoriile de filme din API

  getGenre() {
    return this.http
      .get(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=efbfeb5743f349d94c1b2d862344373f&language=en-US'
      )
      .subscribe((result: any) => {
        this.genre = result.genres;
      });
  }

  //Afisam datele din API ul care este trimis in functie

  getMovies(url: any) {
    this.currentPage = 1;
    this.lastUrl = url;
    //this.LoadingHandler.start();
    if (typeof url == 'object') {
      this.totalPages = 1;
      this.movies = url;
    } else {
      this.http.get(url).subscribe((result: any) => {
        //this.LoadingHandler.finish();
        this.movies = result.results;
        this.totalPages = result.total_pages;
        this.currentPage = result.page;
        this.nextPage = result.page + 1;
        this.prevPage = result.page - 1;
      });
    }
  }

  //Cautam filmele din search field si sunt trimise catre functia de afisare a datelor

  onSearchText(searchValue: any) {
    clearTimeout(this.timeout);
    if (searchValue) {
      this.timeout = setTimeout(() => {
        this.getMovies(
          `https://api.themoviedb.org/3/search/movie?api_key=efbfeb5743f349d94c1b2d862344373f&query=${searchValue}`
        );
      }, 700);
    } else {
      this.getMovies(
        `https://api.themoviedb.org/3/movie/popular?api_key=efbfeb5743f349d94c1b2d862344373f`
      );
    }
  }

  //In functie de categoria de film ceruta se adauga intr-un array id-ul respectiv si este trimis url ul cu toate categoriile din array

  onGenreSearch(genreId: any, genreName: any) {
    if (genreId == '') {
      this.genresSelected.push(genreId);
      this.genredListed.push(genreName);
    } else {
      if (this.genresSelected.includes(genreId)) {
        this.genresSelected.splice(this.genresSelected.indexOf(genreId), 1);
        this.genredListed.splice(this.genresSelected.indexOf(genreName), 1);
      } else {
        this.genresSelected.push(genreId);
        this.genredListed.push(genreName);
      }
    }
    this.getMovies(
      `https://api.themoviedb.org/3/discover/movie?api_key=efbfeb5743f349d94c1b2d862344373f&with_genres=` +
        encodeURI(this.genresSelected.join(','))
    );
  }

  //Se da reset la orice field si se revine la pagina principala cu filmele populare

  resetField() {
    this.genresSelected = [];
    this.genredListed = [];
    this.getMovies(
      `https://api.themoviedb.org/3/movie/popular?api_key=efbfeb5743f349d94c1b2d862344373f`
    );
  }

  //Adaugarea si eliminarea unor filme din sectiunea de favorite

  addToFavourite(favourite: any) {
    this.favouriteSection.push(favourite);
  }

  removeFromFavourite(favourite: any) {
    for (let i = 0; i < this.favouriteSection.length; i++) {
      if (this.favouriteSection[i].id == favourite.id) {
        this.favouriteSection.splice(
          this.favouriteSection.indexOf(this.favouriteSection[i]),
          1
        );
      }
    }
  }

  //Trimiterea listei cu filme favorite catre functia de afisare a filmelor

  showFavourite() {
    this.getMovies(this.favouriteSection);
  }

  //Se testeaza daca filmul se afla sau nu in sectiunea de favorite

  test(movieTest: any) {
    if (this.favouriteSection.some((elem) => elem.id == movieTest.id)) {
      return true;
    } else {
      return false;
    }
  }

  //Apelarea urmatoarei pagini

  nextPageFc(el: HTMLElement) {
    if (this.nextPage <= this.totalPages) {
      this.pageCall(this.nextPage);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //Apelarea paginii de dinainte

  prevPageFc(el: HTMLElement) {
    if (this.prevPage > 0) {
      this.pageCall(this.prevPage);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //Accesarea url-ului in functie de numarul paginii

  pageCall(page: any) {
    let urlSplit = this.lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
      let url = this.lastUrl + '&page=' + page;
      this.getMovies(url);
    } else {
      key[1] = page.toString();
      queryParams[queryParams.length - 1] = key.join('=');
      let url = urlSplit[0] + '?' + queryParams.join('&');
      this.getMovies(url);
    }
  }
}
