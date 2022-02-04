import {useState} from "react";
import axios from "axios";
import './App.css';

// https://www.googleapis.com/books/v1/volumes?q=harry+potter

function App() {
  const [books, setBooks] = useState([]);
  const [parameters, setParameters] = useState("");

  const change = (event) => {
    setParameters(event.target.value);
    if(event.target.value === "" || event.target.value === undefined || event.target.value === null) {
      setBooks([]);
    } else {
      searchBooks(event);
    }
 
  }

  function searchBooks(event) {
    event.preventDefault();
    const searchParamaters = parameters.replaceAll(" ", "+");
    console.log("searching");

    axios.get("https://www.googleapis.com/books/v1/volumes?q=" + searchParamaters).then(
      (response) => {
        const data = response.data;
        const items = data.items;
        const newBooks = [];
    
        if(items != null && items !== undefined) {
          items.forEach((book, i) => {
            const title = book.volumeInfo.title;
            const authorsArray = book.volumeInfo.authors;
            let thumbnail = null;
            let rating = "No Rating";
            
            if(book.volumeInfo.averageRating != undefined && book.volumeInfo.averageRating != null) {
              rating = (book.volumeInfo.averageRating  * 2);
            }

            if(book.volumeInfo.imageLinks.smallThumbnail != undefined) {
              thumbnail = book.volumeInfo.imageLinks.smallThumbnail;
            }

            let authors = "";
            if(authorsArray != null && authorsArray !== undefined) {
              for(var i = 0; i < authorsArray.length; i++) {
                authors += authorsArray[i];
              }
            }
           
  
            newBooks.push(
              {
                "title": title,
                "authors": authors,
                "thumbnail": thumbnail,
                "avarageRating": rating
              }
              )
          });   
        } else {
          setBooks(null);
        }

        setBooks(newBooks);
        console.log("completed searching");
      }

    );
  }


  if(books != null) {
    return (
      <div className="App">
  
      <form onSubmit={searchBooks} className="search">
          <input type="text" className="search__input" placeholder="Search a book by title or author" value={parameters} onChange={change}/>
          <button type="submit" className="search__button">
            <i className="fas fa-search search__button__icon"></i>
          </button>
        </form>
        <div className="books">
        {books.map((currentBook, index) => {
          if(currentBook.thumbnail != null && currentBook.thumbnail !== undefined) {
            return (<div className="book" key={index}>
            <div className="book__photo-box" style={{"background-image": "url(" + currentBook.thumbnail + ")", "background-size": "cover", "background-position": "center"}}></div>
            <div className="book__text-box">
              <h1 className="book__title">{currentBook.title}</h1>
               <p className="book__author">{currentBook.authors}</p>
            </div>
            <div className="book__rating-box">
              <p className="book__rating">{currentBook.avarageRating}</p>
            </div>
          </div>)
          } else {
            return (<div className="book" key={index}>
            <div className="book__photo-box">
               <img src="./photo-not-found.png" alt="" className="book__photo"/>
            </div>
            <div className="book__text-box">
              <h1 className="book__title">{currentBook.title}</h1>
               <p className="book__author">{currentBook.authors}</p>
            </div>
          </div>)
          }
         
        })}
  
          {/* <div className="book">
            <img src="" alt="" className="book__photo" />
            <h1 className="book__title">BookTitle</h1>
            <p className="book__author"></p>
          </div> */}
  
        </div>
  
      </div>
    );
  } else {
    return (  <div className="App">
  
    <form onSubmit={searchBooks} className="search">
        <input type="text" className="search__input" placeholder="Search a book by title or author" value={parameters} onChange={change}/>
        <button type="submit" className="search__button">
          <i className="fas fa-search search__button__icon"></i>
        </button>
      </form>
      <div className="books">
        <p className="noBooksFound">No books could be found with this title or author</p>
      </div>

    </div>);
  }
 
}

export default App;
