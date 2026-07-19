import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tokenNasa = process.env.NEXT_NASA || process.env.NEXT_PUBLIC_NASA_MAP_KEY;
    const BOX_OCCIDENTE_ANTIOQUIA = '-76.0,6.3,-75.6,6.8';

    if (!tokenNasa) {
      console.error("❌ [Server API] No se encontró la clave de la NASA en .env");
      return NextResponse.json({ error: 'Token de la NASA no configurado en el servidor' }, { status: 500 });
    }

    // Retrocedemos 2 días para asegurar datos consolidados
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 2);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    // SOLUCIÓN: Cambiamos 'MODIS_SPHERICAL' por 'VIIRS_NOAA20_NRT' que es la fuente válida y precisa para BBOX
    const fuenteValida = 'VIIRS_NOAA20_NRT'; 
    
    const urlNasa = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${tokenNasa}/${fuenteValida}/${BOX_OCCIDENTE_ANTIOQUIA}/1/${fechaFormateada}`;
    
    console.log(`📡 [Server] Consultando API de la NASA FIRMS con fuente corregida: ${urlNasa}`);

    const response = await fetch(urlNasa, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
      next: { revalidate: 1800 }
    });

    if (!response.ok) {
      const textoError = await response.text();
      console.error(`❌ [Server API] La NASA respondió con error: ${response.status} - ${textoError}`);
      return NextResponse.json({ error: `Error desde los servidores de la NASA: ${response.status}` }, { status: response.status });
    }

    const textoCSV = await response.text();
    console.log(`✅ [Server API] ¡Éxito! Datos CSV recibidos. Filas devueltas: ${textoCSV.split('\n').length}`);
    
    return new NextResponse(textoCSV, {
      status: 200,
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=1800'
      },
    });

  } catch (error: any) {
    console.error("❌ Error en el Route Handler de la NASA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}