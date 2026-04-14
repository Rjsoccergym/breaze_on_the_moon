const { MongoClient } = require('mongodb');

// Variable global para mantener la conexión "caliente" entre invocaciones
let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    // Conectar a MongoDB Atlas
    const client = await MongoClient.connect(uri);
    // Seleccionar la base de datos
    cachedDb = client.db('breaze_in_the_moon_audits'); 
    return cachedDb;
}

exports.handler = async (event, context) => {
    // Permite que la Lambda termine tan pronto como devuelva el resultado, 
    // sin esperar a que la conexión de MongoDB se cierre.
    context.callbackWaitsForEmptyEventLoop = false; 

    try {
        // 1. Extraer el cuerpo de la petición (Asumiendo que viene del API Gateway)
        const requestBody = event.body ? JSON.parse(event.body) : {};

        // 2. Enriquecer el evento según los requerimientos
        const enrichedEvent = {
            ...requestBody, // Los datos enviados por el microservicio (ej. tipo de acción, usuario)
            timestamp: new Date().toISOString(), // Marca de tiempo exacta
            // Capturar el origen (IP o identificador del API Gateway)
            origen: event.requestContext?.identity?.sourceIp || 'api-gateway-interno'
        };

        // 3. Conectar a la base de datos
        // La URI debe estar configurada en las Variables de Entorno de AWS Lambda
        const MONGODB_URI = process.env.MONGODB_URI; 
        
        if (!MONGODB_URI) {
            throw new Error('La variable de entorno MONGODB_URI no está definida.');
        }

        const db = await connectToDatabase(MONGODB_URI);
        const collection = db.collection('event_logs');

        // 4. Persistir el evento enriquecido
        const result = await collection.insertOne(enrichedEvent);

        // 5. Retornar respuesta HTTP exitosa
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'Evento de auditoría registrado exitosamente', 
                eventId: result.insertedId 
            }),
        };

    } catch (error) {
        console.error('Error al registrar la auditoría:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Error interno al procesar la auditoría' }),
        };
    }
};