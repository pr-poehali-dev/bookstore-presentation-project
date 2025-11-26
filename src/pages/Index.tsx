import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  price: number;
  image: string;
}

const books: Book[] = [
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
  },
  {
    id: 5,
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    genre: 'Классика',
    price: 1200,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/abbe18a5-2f70-4b38-8ca5-16694f92591a.jpg'
  },
  {
    id: 6,
    title: 'Евгений Онегин',
    author: 'Александр Пушкин',
    year: 1833,
    genre: 'Поэзия',
    price: 650,
    image: 'https://cdn.poehali.dev/projects/cd80ab4d-0112-4cb2-b18d-0a0815004ae5/files/f8897a0d-7c5d-4804-8ec8-f23e92c8f6de.jpg'
  }
];

interface CartItem extends Book {
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const genres = ['all', ...Array.from(new Set(books.map(b => b.genre)))];
  const authors = ['all', ...Array.from(new Set(books.map(b => b.author)))];
  const years = ['all', ...Array.from(new Set(books.map(b => b.year.toString())))];

  const filteredBooks = books.filter(book => {
    if (selectedGenre !== 'all' && book.genre !== selectedGenre) return false;
    if (selectedAuthor !== 'all' && book.author !== selectedAuthor) return false;
    if (selectedYear !== 'all' && book.year.toString() !== selectedYear) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">Книжная лавка</h1>
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
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-6xl font-bold mb-4 tracking-tight">Классика русской литературы</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Тщательно отобранные произведения великих писателей
          </p>
        </section>

        <section className="mb-12">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium">Фильтры:</span>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Жанр" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre === 'all' ? 'Все жанры' : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Автор" />
              </SelectTrigger>
              <SelectContent>
                {authors.map(author => (
                  <SelectItem key={author} value={author}>
                    {author === 'all' ? 'Все авторы' : author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Год издания" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'Все годы' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedGenre !== 'all' || selectedAuthor !== 'all' || selectedYear !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedGenre('all');
                  setSelectedAuthor('all');
                  setSelectedYear('all');
                }}
              >
                <Icon name="X" size={16} className="mr-1" />
                Сбросить
              </Button>
            )}
          </div>
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
              Книги не найдены. Попробуйте изменить фильтры.
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
