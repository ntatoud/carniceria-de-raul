import { Request, Response } from 'express';
import PDFDocument from 'pdfkit-table';
import { formatDate } from '../date/utils.js';

export const generateBillPDF = (
  req: Request,
  res: Response,
  order: (Order & CartProduct)[]
) => {
  const { user } = req.session;
  if (!user) throw new Error('No user found');

  const doc = new PDFDocument();

  const filename =
    'Factura-' +
    encodeURIComponent(
      order[0]?.email === '' || !order[0]?.email ? user.email : order[0]!.email!
    ) +
    '-' +
    encodeURIComponent(formatDate(order[0]!.orderDate)) +
    '-.pdf';

  res.setHeader(
    'Content-disposition',
    'attachment; filename="' + filename + '"'
  );
  res.setHeader('Content-type', 'application/pdf');

  billingPDFHeader(doc);

  doc.y = 300;

  billingPDFOrderInfos(doc, user, order[0]);

  billingPDFProducts(doc, order);

  doc.pipe(res);
  doc.end();

  return doc;
};

const billingPDFHeader = (doc: PDFKit.PDFDocument) => {
  doc.font('Helvetica-Bold');
  doc.fontSize(18);
  doc.image('public/assets/images/icon.png', 80, 80, { width: 150 });
  doc.text('FACTURA', {
    align: 'right',
  });
  doc.moveDown(0.5);

  doc.font('Helvetica');
  doc.fontSize(14);
  doc.text('Carniceria Raul', {
    align: 'right',
  });
  doc.moveDown(0.5);

  doc.text('Merca Sanfermin', {
    align: 'right',
  });
  doc.moveDown(0.5);

  doc.text('CIF: B12345678', {
    align: 'right',
  });
  doc.moveDown(0.5);
};

const billingPDFOrderInfos = (
  doc: PDFKit.PDFDocument,
  user: Account,
  order: (Order & CartProduct) | undefined
) => {
  doc.fontSize(12);
  doc.font('Helvetica');
  doc.text('Client: ');
  doc.font('Helvetica-Bold');
  doc.text(user.name + ' ' + user.surname);

  doc.moveDown(0.5);

  doc.font('Helvetica');
  doc.text('Correo: ');
  doc.font('Helvetica-Bold');
  doc.text(order!.email === '' || !order?.email ? user.email : order!.email!);
  doc.moveDown(0.5);

  doc.font('Helvetica');
  doc.text('Fecha de recuperacion: ');
  doc.font('Helvetica-Bold');
  doc.text(formatDate(order!.recoveryDate));
  doc.moveDown(0.5);

  doc.font('Helvetica');
  doc.text('Fecha de pedido: ');
  doc.font('Helvetica-Bold');
  doc.text(formatDate(order!.orderDate));
  doc.moveDown(0.5);

  doc.font('Helvetica');
  doc.text('Comment: ');
  doc.font('Helvetica-Bold');
  doc.text(order!.comment ?? 'No comment');
  doc.moveDown(0.5);
};

const billingPDFProducts = (
  doc: PDFDocument,
  order: (Order & CartProduct)[]
) => {
  const table = {
    title: 'Productos',
    headers: ['Name', 'Price', 'Quantity', 'Weight', 'Total (€)'],
    rows: [
      ...order.map((product) => {
        return [
          product.name,
          (product.sale
            ? (+product.salePrice!).toFixed(2)
            : (+product.price).toFixed(2)) +
            ' ' +
            product.unit,
          String(product.totalQuantity),
          String(product.unit === '€/kg' ? product.weight + 'g' : '-'),
          product.sale
            ? (
                +product.salePrice! *
                +product.totalQuantity *
                (product.unit === '€/kg' ? +product.weight / 1000 : 1)
              ).toFixed(2)
            : (
                +product.price! *
                +product.totalQuantity *
                (product.unit === '€/kg' ? +product.weight / 1000 : 1)
              ).toFixed(2),
        ];
      }),
    ],
  };
  doc.fontSize(14);
  doc.table(table, {
    minRowHeight: 30,
    divider: {
      horizontal: {
        opacity: 0.5,
      },
    },
  });
  doc.text('TOTAL: ' + (+order[0]!.totalPrice).toFixed(2) + ' €', {
    align: 'right',
  });
};
