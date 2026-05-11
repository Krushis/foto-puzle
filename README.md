# FotoPuzle

## Komandos nariai

- Lukas Rudėnas
- Domas Stanislauskas
- Rapolas Viskaitis
- Nojus Baranauskas

---

## Techninė užduotis

FotoPuzle — tai pilnos apimties žiniatinklio programa, leidžianti vartotojams įkelti nuotraukas ir paversti jas interaktyviomis dėlionėmis. Sistema apima:

- **Vartotojų valdymą** — registracija, prisijungimas, profilio ir slaptažodžio keitimas
- **Nuotraukų valdymą** — nuotraukų įkėlimas, peržiūra, šalinimas
- **Dėlionių generavimą** — dėlionės kūrimas iš nuotraukos su pasirenkamu sunkumu ir detalių skaičiumi
- **Užbaigimo žetonai** — vartotojas gauna žetoną sėkmingai užbaigęs dėlionę
- **Užsakymų sistema** — fizinės dėlionės spausdinimo užsakymo pateikimas ir sekimas

### Technologijų stack'as

| Dalis | Technologija |
|---|---|
| Frontend | React 19, Vite |
| Backend | .NET 8, ASP.NET Core Web API |
| Duomenų bazė | MySQL 8, Entity Framework Core (Pomelo) |
| Autentifikacija | JWT Bearer tokenai |

---

## Projekto struktūra

```
foto-puzle/
├── backend/        # .NET 8 REST API
├── frontend/       # React + Vite SPA
└── docs/           # Papildoma dokumentacija
```

Kiekvienos dalies paleidimo instrukcijos:

- [Backend README](backend/README.md)
- [Duomenų bazės README](backend/DB_README.md)
- [Frontend README](frontend/README.md)

---

## Testavimas ir jo rezultatai

Projektas buvo testuojamas rankiniu būdu naudojant Swagger UI (backend) ir naršyklę (frontend).

### Backend — Swagger testai

| Sritis | Endpoint | Tikrintas scenarijus | Rezultatas |
|---|---|---|---|
| Autentifikacija | `POST /api/auth/register` | Naujo vartotojo registracija | ✅ |
| Autentifikacija | `POST /api/auth/login` | Prisijungimas su teisingais duomenimis | ✅ |
| Autentifikacija | `POST /api/auth/login` | Prisijungimas su neteisingais duomenimis | ✅ 401 |
| Vartotojai | `GET /api/user/{id}` | Profilio gavimas su JWT | ✅ |
| Vartotojai | `GET /api/user/{id}` | Kito vartotojo profilio gavimas | ✅ 403 |
| Vartotojai | `PUT /api/user/{id}/password` | Slaptažodžio keitimas | ✅ |
| Nuotraukos | `POST /api/photo` | Nuotraukos įkėlimas | ✅ |
| Nuotraukos | `GET /api/photo` | Vartotojo nuotraukų sąrašas | ✅ |
| Nuotraukos | `DELETE /api/photo/{id}` | Nuotraukos šalinimas | ✅ |
| Dėlionės | `POST /api/puzzle` | Dėlionės generavimas iš nuotraukos | ✅ |
| Dėlionės | `GET /api/puzzle` | Vartotojo dėlionių sąrašas | ✅ |
| Žetonai | `POST /api/completiontoken/issue` | Žetono išdavimas po dėlionės | ✅ |
| Žetonai | `GET /api/completiontoken/my` | Vartotojo žetonų sąrašas | ✅ |
| Žetonai | `GET /api/completiontoken/validate` | Žetono validacija | ✅ |
| Užsakymai | `POST /api/order` | Užsakymo pateikimas | ✅ |
| Užsakymai | `GET /api/user/{id}/orders` | Vartotojo užsakymų sąrašas | ✅ |

### Frontend — rankinis tikrinimas

| Funkcija | Tikrintas scenarijus | Rezultatas |
|---|---|---|
| Registracija | Naujo vartotojo sukūrimas | ✅ |
| Prisijungimas | Teisingi / neteisingi duomenys | ✅ |
| Nuotraukos įkėlimas | Failo pasirinkimas ir įkėlimas | ✅ |
| Dėlionės kūrimas | Sunkumo ir detalių pasirinkimas | ✅ |
| Dėlionės žaidimas | Detalių tvarkymas naršyklėje | ✅ |
| Užsakymo pateikimas | Formos pildymas ir siuntimas | ✅ |
| Profilio peržiūra | Vartotojo duomenų rodymas | ✅ |

---

## Naudotojo dokumentacija

### Pradžia

1. Atidarykite programą naršyklėje
2. Užsiregistruokite arba prisijunkite prie esamos paskyros

### Dėlionės kūrimas

1. Eikite į **Nuotraukos** skiltį ir įkelkite nuotrauką
2. Pasirinkite įkeltą nuotrauką ir spauskite **Kurti dėlionę**
3. Pasirinkite sunkumą ir detalių skaičių
4. Spauskite **Generuoti** — dėlionė bus sukurta ir pasiekiama jūsų sąraše

### Dėlionės žaidimas

1. Eikite į **Dėlionės** skiltį
2. Pasirinkite norimą dėlionę ir spauskite **Žaisti**
3. Sudėkite detales į teisingas vietas
4. Sėkmingai užbaigus — gausite užbaigimo žetoną

### Užsakymas

1. Eikite į užbaigtos dėlionės puslapį
2. Spauskite **Užsakyti spausdinimą**
3. Užpildykite pristatymo duomenis ir patvirtinkite užsakymą
4. Užsakymo būseną galite sekti skiltyje **Užsakymai**