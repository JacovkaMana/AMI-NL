# D&D Application Frontend Architecture Documentation

## Technology Stack

### Core Technologies
- React 18.2.0
- TypeScript 4.9.5
- Vite 4.4.0 (Build tool)
- TailwindCSS 3.3.3

### State Management
- Redux Toolkit
- RTK Query for API calls
- Redux Persist for state persistence

### Key Libraries
- react-router-dom (v6)
- @heroicons/react
- react-hook-form
- zod (validation)
- socket.io-client
- react-markdown

## Project Structure

```
src/
├── components/
│   ├── character/
│   ├── chat/
│   ├── common/
│   └── layout/
├── features/
│   ├── auth/
│   ├── character/
│   └── chat/
├── hooks/
├── services/
├── store/
├── types/
└── utils/
```

## Feature Modules

### Authentication
- JWT-based auth
- Protected routes
- Persistent sessions
- Role-based access control

### Character Creation
- Multi-step form
- Real-time validation
- Image generation integration
- Character sheet preview

### Chat System
- WebSocket integration
- Message persistence
- Character context injection
- Markdown support

## State Management

### Store Structure
```typescript
interface RootState {
  auth: AuthState;
  character: CharacterState;
  chat: ChatState;
  ui: UIState;
}
```

### API Integration
- RTK Query endpoints
- Automatic cache invalidation
- Optimistic updates
- Error handling

## Component Architecture

### Base Components
- Button
- Input
- Select
- Card
- Modal
- Toast

### Composite Components
- CharacterSheet
- ChatWindow
- DiceRoller
- ImageGenerator

## Routing Structure

```typescript
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/characters', element: <Characters /> },
      { path: '/create', element: <CharacterCreation /> },
      { path: '/chat', element: <ChatRoom /> }
    ]
  }
];
```

## Data Flow

### Character Creation
1. Form data collection
2. Validation
3. API submission
4. Image generation
5. State update

### Chat System
1. Message composition
2. Character context injection
3. WebSocket emission
4. State update
5. UI render

## Error Handling

### API Errors
- Global error boundary
- Toast notifications
- Retry mechanisms
- Fallback UI

### Form Validation
- Schema-based validation
- Real-time feedback
- Field-level errors
- Form-level errors

## Performance Optimization

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### Caching Strategy
- RTK Query cache
- Browser storage
- Image optimization

## Testing Strategy

### Unit Tests
- Component testing
- Hook testing
- Utility function testing

### Integration Tests
- User flows
- API integration
- State management

## Build Configuration

### Environment Variables
```typescript
VITE_API_URL=string
VITE_WS_URL=string
VITE_IMAGE_API_KEY=string
```

### Build Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest"
}
```
