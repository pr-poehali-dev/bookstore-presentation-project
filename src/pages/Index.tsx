import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const initialBooks = [
  {
    id: 1,
    title: 'Тихий Дон',
    author: 'Михаил Шолохов',
    year: 1940,
    genre: 'Классика',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/758ba18a-90db-4b78-8d64-d4c2876bccad.jpg'
  },
  {
    id: 2,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    year: 1967,
    genre: 'Фантастика',
    price: 750,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/abbe18a5-2f70-4b38-8ca5-16694f92591a.jpg'
  },
  {
    id: 3,
    title: 'Анна Каренина',
    author: 'Лев Толстой',
    year: 1877,
    genre: 'Классика',
    price: 950,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/f8897a0d-7c5d-4804-8ec8-f23e92c8f6de.jpg'
  },
  {
    id: 4,
    title: 'Преступление и наказание',
    author: 'Федор Достоевский',
    year: 1866,
    genre: 'Классика',
    price: 820,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/758ba18a-90db-4b78-8d64-d4c2876bccad.jpg'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(initialBooks);
  const [cart, setCart] = useState([]);
  const [searchAuthor, setSearchAuthor] = useState('');
  const [user, setUser] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  const addToCart = (book) => {
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredBooks = books.filter(book =>
    book.author.toLowerCase().includes(searchAuthor.toLowerCase())
  );

  const handleAddBook = (e) => {
    e.preventDefault();
    
    if (!newTitle || !newAuthor || !newYear || !newGenre || !newPrice) {
      alert('Заполните все поля!');
      return;
    }

    const newBook = {
      id: books.length + 1,
      title: newTitle,
      author: newAuthor,
      year: Number(newYear),
      genre: newGenre,
      price: Number(newPrice),
      image: newImage || 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/758ba18a-90db-4b78-8d64-d4c2876bccad.jpg'
    };

    setBooks([...books, newBook]);
    setNewTitle('');
    setNewAuthor('');
    setNewYear('');
    setNewGenre('');
    setNewPrice('');
    setNewImage('');
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight">Книжная лавка</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-2xl">Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-muted-foreground text-center py-12">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <Card key={item.id} className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-24 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{item.author}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                  </div>
                                  <span className="font-semibold">{item.price * item.quantity} ₽</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <div className="border-t pt-4 mt-6">
                          <div className="flex justify-between items-center text-lg font-semibold mb-4">
                            <span>Итого:</span>
                            <span>{totalPrice} ₽</span>
                          </div>
                          <Button size="lg" className="w-full">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-6xl font-bold mb-4 tracking-tight">Классика русской литературы</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Тщательно отобранные произведения великих писателей
          </p>
        </section>

        <section className="mb-12 flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Поиск по автору..."
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
            className="max-w-sm"
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить книгу
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Добавить новую книгу</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBook} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Название книги"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Автор</label>
                  <Input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Имя автора"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Год</label>
                  <Input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Жанр</label>
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Жанр"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ссылка на изображение (необязательно)</label>
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Добавить
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {book.genre}
                </Badge>
                <h3 className="text-2xl font-semibold mb-2">{book.title}</h3>
                <p className="text-muted-foreground mb-1">{book.author}</p>
                <p className="text-sm text-muted-foreground mb-4">{book.year}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{book.price} ₽</span>
                  <Button onClick={() => addToCart(book)}>
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Книги не найдены. Попробуйте изменить фильтр.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Книжная лавка. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
