const fs = require('fs');
const path = require('path');

// Dados dos testes de aceitação
const acceptanceTests = {
  title: "Testes de Aceitação - NestJS Realworld App",
  description: "Cobertura de funcionalidades críticas da aplicação",
  tests: [
    {
      name: "Registro de Usuário",
      endpoint: "POST /api/users",
      description: "Criação de novo usuário com validação",
      status: "✅ Implementado",
      priority: "Alta"
    },
    {
      name: "Autenticação de Usuário", 
      endpoint: "POST /api/users/login",
      description: "Login com credenciais válidas",
      status: "✅ Implementado",
      priority: "Alta"
    },
    {
      name: "Perfil do Usuário",
      endpoint: "GET /api/user", 
      description: "Obtenção de dados do usuário autenticado",
      status: "✅ Implementado",
      priority: "Alta"
    },
    {
      name: "Criação de Artigos",
      endpoint: "POST /api/articles",
      description: "Criação de artigos por usuário autenticado",
      status: "🔄 Pendente",
      priority: "Média"
    },
    {
      name: "Listagem de Artigos",
      endpoint: "GET /api/articles",
      description: "Listagem de todos os artigos",
      status: "🔄 Pendente", 
      priority: "Média"
    },
    {
      name: "Comentários em Artigos",
      endpoint: "POST /api/articles/:slug/comments",
      description: "Adição de comentários em artigos",
      status: "🔄 Pendente",
      priority: "Baixa"
    }
  ],
  metrics: {
    totalEndpoints: 6,
    implemented: 3,
    pending: 3,
    coverage: "50%"
  }
};

// Gerar relatório HTML
const generateHTMLReport = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${acceptanceTests.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .metrics { display: flex; justify-content: space-around; margin: 30px 0; }
        .metric { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .metric h3 { margin: 0; color: #007bff; }
        .metric p { margin: 5px 0; font-size: 24px; font-weight: bold; }
        .tests-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-top: 30px; }
        .test-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .test-card h3 { margin: 0 0 10px 0; color: #333; }
        .endpoint { background: #e9ecef; padding: 8px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status.implemented { background: #d4edda; color: #155724; }
        .status.pending { background: #fff3cd; color: #856404; }
        .priority { font-size: 12px; color: #666; }
        .coverage-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .coverage-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; width: ${acceptanceTests.metrics.coverage}; transition: width 0.3s; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${acceptanceTests.title}</h1>
        <p style="text-align: center; color: #666;">${acceptanceTests.description}</p>
        
        <div class="metrics">
            <div class="metric">
                <h3>Total de Endpoints</h3>
                <p>${acceptanceTests.metrics.totalEndpoints}</p>
            </div>
            <div class="metric">
                <h3>Implementados</h3>
                <p>${acceptanceTests.metrics.implemented}</p>
            </div>
            <div class="metric">
                <h3>Pendentes</h3>
                <p>${acceptanceTests.metrics.pending}</p>
            </div>
            <div class="metric">
                <h3>Cobertura</h3>
                <p>${acceptanceTests.metrics.coverage}</p>
            </div>
        </div>
        
        <div class="coverage-bar">
            <div class="coverage-fill"></div>
        </div>
        
        <div class="tests-grid">
            ${acceptanceTests.tests.map(test => `
                <div class="test-card">
                    <h3>${test.name}</h3>
                    <div class="endpoint">${test.endpoint}</div>
                    <p>${test.description}</p>
                    <span class="status ${test.status.includes('✅') ? 'implemented' : 'pending'}">${test.status}</span>
                    <div class="priority">Prioridade: ${test.priority}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync('coverage/acceptance-report.html', html);
  console.log('✅ Relatório HTML gerado em: coverage/acceptance-report.html');
};

// Gerar relatório JSON para integração com outras ferramentas
const generateJSONReport = () => {
  const report = {
    generatedAt: new Date().toISOString(),
    ...acceptanceTests
  };
  
  fs.writeFileSync('coverage/acceptance-report.json', JSON.stringify(report, null, 2));
  console.log('✅ Relatório JSON gerado em: coverage/acceptance-report.json');
};

// Executar geração de relatórios
if (!fs.existsSync('coverage')) {
  fs.mkdirSync('coverage');
}

generateHTMLReport();
generateJSONReport(); 