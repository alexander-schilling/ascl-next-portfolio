import type { PortfolioDiagnostics } from "@/types/portfolio-api";

type MissingContentAlertProps = {
  diagnostics: PortfolioDiagnostics;
};

export function MissingContentAlert({ diagnostics }: MissingContentAlertProps) {
  const showDebugDetails = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_CONTENT_WARNINGS === "true";

  if (!showDebugDetails) {
    return null;
  }

  if (
    diagnostics.missingContentTypes.length === 0
    && diagnostics.duplicateContentTypes.length === 0
    && diagnostics.unknownContentTypes.length === 0
    && diagnostics.warnings.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-b border-amber-300/30 bg-amber-100/90 px-6 py-4 text-amber-950 mt-20">
      <div className="mx-auto w-full max-w-7xl space-y-3 text-sm">
        {diagnostics.missingContentTypes.length > 0 ? (
          <div>
            <p className="font-semibold">Faltan content types en PocketBase para reemplazar contenido:</p>
            <p>{diagnostics.missingContentTypes.join(", ")}</p>
          </div>
        ) : null}

        {diagnostics.duplicateContentTypes.length > 0 ? (
          <div>
            <p className="font-semibold">Hay content types duplicados en PocketBase (se usa el ultimo valor encontrado):</p>
            <p>{diagnostics.duplicateContentTypes.join(", ")}</p>
          </div>
        ) : null}

        {diagnostics.unknownContentTypes.length > 0 ? (
          <div>
            <p className="font-semibold">Hay content types no reconocidos por el frontend:</p>
            <p>{diagnostics.unknownContentTypes.join(", ")}</p>
          </div>
        ) : null}

        {diagnostics.warnings.length > 0 ? (
          <div>
            <p className="font-semibold">Advertencias de integracion:</p>
            <ul className="list-disc pl-5">
              {diagnostics.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}



