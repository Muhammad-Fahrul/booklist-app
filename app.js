// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI displays
class UI {
    static displayBooks() {
        const books = Store.getBookFromStorage();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const row = document.createElement('tr');
        const bookContainer =
            `<td>${book.title}</td>
             <td>${book.author}</td>
             <td>${book.isbn}</td>
             <td class="btn"><a href="#" class="btn-remove">x</a></td>`
        row.innerHTML = bookContainer;

        document.querySelector('#book-container tbody').append(row);
    }

    static clearFields() {
        document.querySelector('#book-title').value = '';
        document.querySelector('#book-author').value = '';
        document.querySelector('#book-isbn').value = '';

    }

    static deleteBook(el) {
        if (el.classList.contains('btn-remove')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, nameClass) {
        const div = document.createElement('div');
        div.innerText = message;
        div.classList.add('alert-message');
        div.classList.add(nameClass);
        const form = document.querySelector('#book-form')
        document.querySelector('.container').insertBefore(div, form);

        setTimeout(() => {
            div.remove()
        }, 2000);

    }
}

// Store Class
class Store {
    static getBookFromStorage() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addToStorage(book) {
        const books = Store.getBookFromStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBookFromStorage();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add Book to UI
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.querySelector('#book-title').value;
    const author = document.querySelector('#book-author').value;
    const isbn = document.querySelector('#book-isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Isi semua fields', 'bg-red')
    } else {
        const book = new Book(title, author, isbn);

        UI.addBookToList(book);

        UI.showAlert('Buku berhasil ditambahkan', 'bg-green');

        Store.addToStorage(book);

        UI.clearFields()
    }
});

// Event: Remove Book from UI
document.querySelector('#book-container').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Buku berhasil dihapus', 'bg-green');
})