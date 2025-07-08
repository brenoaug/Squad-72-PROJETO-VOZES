import axios from 'axios';

// Define a URL base da API.
// process.env.REACT_APP_API_URL será injetado pelo Docker Compose (ou pelo create-react-app em dev).
// O fallback 'http://localhost:8080' é para quando a variável de ambiente não está definida,
// por exemplo, se você rodar o npm start puro sem o Docker Compose.
// A parte '/api' do endpoint será adicionada aqui, pois você a usa em todas as chamadas.
// Para projetos Vite, use import.meta.env; para Create React App, mantenha process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  // Combina a URL base dinâmica com o prefixo '/api'
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    // Adicione outros cabeçalhos padrão aqui, se necessário (ex: para autenticação)
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

export default api;