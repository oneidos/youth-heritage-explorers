import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { FSL_HOURS_PER_TOUR, FSL_MAX_TOURS_PER_MONTH } from "@/lib/cicero";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type FslDocData = {
  studentName: string;
  school: string | null;
  city: string | null;
  age: number | null;
};

/** Documento precompilato da presentare alla dirigenza scolastica. */
export async function downloadFslPresentation(data: FslDocData) {
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "cicero-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: `${data.city ?? "____"}, ${today}` })],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "Richiesta di riconoscimento attività PCTO / FSL",
                bold: true,
                size: 30,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Al Dirigente Scolastico di ", bold: true }),
              new TextRun({ text: data.school ?? "________________________________" }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            children: [
              new TextRun("Il/La sottoscritto/a "),
              new TextRun({ text: data.studentName, bold: true }),
              new TextRun(
                `${data.age ? `, ${data.age} anni` : ""}, studente/studentessa presso questo istituto, chiede che l'attività di guida svolta tramite la piattaforma Cicero venga riconosciuta come percorso di Formazione Scuola Lavoro (PCTO).`,
              ),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Come funziona Cicero", bold: true, size: 26 })],
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Cicero è un'applicazione che mette in contatto studenti delle scuole superiori: da un lato chi desidera scoprire una città italiana, dall'altro chi vi abita e ne conosce il patrimonio culturale. Lo studente-cicerone costruisce un itinerario nel proprio territorio, indica tappe, punto d'incontro e durata, e accoglie un coetaneo visitatore accompagnandolo lungo il percorso.",
              ),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: "Valenza formativa dell'attività", bold: true, size: 26 }),
            ],
          }),
          ...[
            "Ricerca e rielaborazione di contenuti storico-artistici sul patrimonio locale.",
            "Competenze comunicative e di public speaking in italiano e in lingua straniera.",
            "Organizzazione e gestione del tempo: progettazione di un itinerario con tappe e durata.",
            "Educazione all'accoglienza e all'accessibilità, con percorsi dedicati a persone con disabilità.",
            "Cittadinanza attiva e valorizzazione del patrimonio culturale del territorio.",
          ].map(
            (text) =>
              new Paragraph({
                numbering: { reference: "cicero-bullets", level: 0 },
                children: [new TextRun(text)],
              }),
          ),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Monte ore proposto", bold: true, size: 26 })],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `Ogni guida completata viene riconosciuta come ${FSL_HOURS_PER_TOUR} ore di attività, per un massimo di ${FSL_MAX_TOURS_PER_MONTH} guide al mese (${FSL_HOURS_PER_TOUR * FSL_MAX_TOURS_PER_MONTH} ore mensili). L'applicazione registra automaticamente le guide svolte e produce un riepilogo mensile in formato PDF, che lo studente consegna al docente coordinatore per la validazione.`,
              ),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Si allega il riepilogo mensile delle ore generato dall'applicazione.",
                italics: true,
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({ children: [new TextRun("Firma dello studente: ______________________")] }),
          new Paragraph({ children: [new TextRun("")] }),
          new Paragraph({
            children: [new TextRun("Visto del Dirigente Scolastico: ______________________")],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  download(blob, "Cicero-richiesta-PCTO.docx");
}

export type FslHourRow = {
  activity_date: string;
  hours: number;
  note: string | null;
};

/** Riepilogo mensile delle ore, da consegnare al docente coordinatore. */
export async function downloadFslHoursPdf(args: {
  studentName: string;
  school: string | null;
  monthLabel: string;
  rows: FslHourRow[];
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.06, 0.07, 0.09);
  const grey = rgb(0.45, 0.47, 0.52);

  let y = 780;
  page.drawText("Cicero — Riepilogo ore PCTO / FSL", { x: 50, y, size: 18, font: bold, color: ink });
  y -= 26;
  page.drawText(`Mese di riferimento: ${args.monthLabel}`, { x: 50, y, size: 11, font, color: grey });
  y -= 30;
  page.drawText(`Studente: ${args.studentName}`, { x: 50, y, size: 12, font, color: ink });
  y -= 18;
  page.drawText(`Istituto: ${args.school ?? "—"}`, { x: 50, y, size: 12, font, color: ink });
  y -= 34;

  page.drawText("Data", { x: 50, y, size: 11, font: bold, color: ink });
  page.drawText("Ore", { x: 150, y, size: 11, font: bold, color: ink });
  page.drawText("Attività", { x: 210, y, size: 11, font: bold, color: ink });
  y -= 8;
  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 0.8,
    color: grey,
  });
  y -= 18;

  let total = 0;
  for (const row of args.rows) {
    total += Number(row.hours);
    const date = new Date(row.activity_date).toLocaleDateString("it-IT");
    page.drawText(date, { x: 50, y, size: 10, font, color: ink });
    page.drawText(String(row.hours), { x: 150, y, size: 10, font, color: ink });
    page.drawText((row.note ?? "Guida Cicero").slice(0, 60), {
      x: 210,
      y,
      size: 10,
      font,
      color: ink,
    });
    y -= 16;
    if (y < 120) break;
  }

  if (args.rows.length === 0) {
    page.drawText("Nessuna guida registrata in questo mese.", {
      x: 50,
      y,
      size: 10,
      font,
      color: grey,
    });
    y -= 16;
  }

  y -= 10;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.8, color: grey });
  y -= 20;
  page.drawText(`Totale ore del mese: ${total}`, { x: 50, y, size: 12, font: bold, color: ink });
  y -= 50;
  page.drawText("Firma del docente coordinatore: ______________________", {
    x: 50,
    y,
    size: 11,
    font,
    color: ink,
  });

  const bytes = await pdf.save();
  download(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), "Cicero-ore-PCTO.pdf");
}
