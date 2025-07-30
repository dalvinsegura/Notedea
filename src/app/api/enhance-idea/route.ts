import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El contenido no puede estar vacío' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: 'El contenido es muy corto para procesar' },
        { status: 400 }
      );
    }

    const prompt = `Eres un asistente experto en mejorar ideas y contenido en español. Tu tarea es tomar una idea y mejorarla manteniendo el formato Markdown.

INSTRUCCIONES:
- Mantén la esencia y el propósito original de la idea
- Mejora la claridad, estructura y coherencia
- Agrega detalles útiles y ejemplos cuando sea apropiado
- Usa formato Markdown para organizar mejor el contenido
- Mantén un tono profesional pero accesible
- Si la idea es muy corta, expándela con contexto relevante
- Si es muy larga, organízala mejor con encabezados y secciones

Título original: ${title || 'Sin título'}

Contenido original:
${content}

Por favor, devuelve una versión mejorada de esta idea en formato Markdown:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en mejorar ideas y contenido en español. Respondes únicamente con el contenido mejorado en formato Markdown, sin explicaciones adicionales."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const enhancedContent = completion.choices[0]?.message?.content;

    if (!enhancedContent) {
      return NextResponse.json(
        { error: 'No se pudo generar contenido mejorado' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      enhancedContent: enhancedContent.trim(),
      originalContent: content,
      originalTitle: title,
    });

  } catch (error) {
    console.error('Error en API de OpenAI:', error);
    
    if (error instanceof Error) {
      // Error específico de OpenAI
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Clave de API de OpenAI no configurada correctamente' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Error al procesar la solicitud: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
