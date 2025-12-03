# API Endpoints

## Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

## Account
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/account` | Listar cuentas |
| GET | `/api/account/{id}` | Obtener cuenta por ID |
| GET | `/api/account/user/{userId}` | Obtener cuentas por usuario |
| POST | `/api/account` | Crear cuenta |
| PUT | `/api/account/{id}` | Actualizar cuenta |
| DELETE | `/api/account/{id}` | Eliminar cuenta |

## Transaction
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/transaction` | Listar transacciones |
| GET | `/api/transaction/{id}` | Obtener transacción por ID |
| GET | `/api/transaction/account/{accountId}` | Obtener transacciones por cuenta |
| POST | `/api/transaction/deposit` | Realizar depósito |
| POST | `/api/transaction/withdrawal` | Realizar retiro |
| POST | `/api/transaction/transfer` | Realizar transferencia |

## URLs Base
- **Dotnet:** `http://localhost:5000`
- **Java:** `http://localhost:8080`
