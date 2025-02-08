export default function ModelSelector({ models, currentModel, onSelectModel }) {
  return (
    <div className="fixed top-0 left-0 p-4 bg-black/50 rounded-br-lg backdrop-blur-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3MF Models</h2>
        <div className="space-y-2">
          {models.map((model) => (
            <div key={model.name} className="flex items-center space-x-2">
              <button
                onClick={() => onSelectModel(model)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentModel.name === model.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {model.name}
              </button>
              <a
                href={model.url}
                download={model.name}
                className="p-2 text-gray-200 hover:text-white rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Download model"
              >
                ⬇️
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 