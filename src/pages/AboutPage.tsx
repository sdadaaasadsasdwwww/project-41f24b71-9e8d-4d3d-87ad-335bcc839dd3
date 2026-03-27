import { Flower2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Flower2 className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="heading-display mb-6">Про нас</h1>
        <p className="text-body mb-6">
          «Квітковий Рай» — це команда флористів, які створюють неповторні букети з любов'ю та увагою до кожної деталі. 
          Ми працюємо з 2018 року і вже доставили тисячі букетів по всій Україні.
        </p>
        <p className="text-body mb-6">
          Кожен наш букет — це маленький витвір мистецтва. Ми ретельно обираємо найсвіжіші квіти від перевірених постачальників
          та створюємо композиції, які дарують радість та натхнення.
        </p>
        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { value: '5000+', label: 'Доставлених букетів' },
            { value: '4.9', label: 'Середній рейтинг' },
            { value: '6', label: 'Років досвіду' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold font-serif text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
