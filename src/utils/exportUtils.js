import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility to export arbitrary data to CSV
export const exportToCSV = (items, filename = 'pulsefit-export.csv') => {
  if (!items || !items.length) {
    alert('No data available to export.');
    return;
  }

  const keys = Object.keys(items[0]).filter(k => k !== '__v' && k !== '_id');
  const csvRows = [];

  // Header row
  csvRows.push(keys.map(k => `"${k}"`).join(','));

  // Data rows
  items.forEach(item => {
    const values = keys.map(key => {
      const val = item[key];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Utility to generate a comprehensive PDF Report
export const exportToPDF = ({ user, workouts = [], nutrition = [], progress = [], stats = {} }) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // Header Background Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Electric Lime)
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 197, 94); // lime
  doc.setFontSize(22);
  doc.text('PULSEFIT', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.text('PREMIUM FITNESS & PERFORMANCE REPORT', 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, 14, 35);

  // User details on the right
  if (user) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(user.name || 'Athlete', pageWidth - 14, 20, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(user.email || '', pageWidth - 14, 28, { align: 'right' });
    doc.text(`Goal: ${user.fitnessGoal || 'General Fitness'}`, pageWidth - 14, 35, { align: 'right' });
  }

  let yPos = 55;

  // Summary Metrics Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Fitness Summary', 14, yPos);
  yPos += 8;

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const latestWeight = progress.length ? progress[0].weight : (user?.weight || 75);

  // Metric Cards (drawn as boxes)
  const metrics = [
    { label: 'Total Workouts', value: `${workouts.length} sessions` },
    { label: 'Time Trained', value: `${totalWorkoutMinutes} mins` },
    { label: 'Est. Cal Burned', value: `${totalCaloriesBurned} kcal` },
    { label: 'Current Weight', value: `${latestWeight} ${user?.unitPreference || 'KG'}` },
  ];

  const boxWidth = (pageWidth - 28 - (metrics.length - 1) * 4) / metrics.length;
  metrics.forEach((m, idx) => {
    const x = 14 + idx * (boxWidth + 4);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, yPos, boxWidth, 22, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 4, yPos + 7);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.value, x + 4, yPos + 16);
  });

  yPos += 30;

  // Recent Workouts Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Recent Workout Logs', 14, yPos);
  yPos += 4;

  const workoutTableData = workouts.slice(0, 10).map(w => [
    w.date || '-',
    w.exerciseName || '-',
    w.category || '-',
    `${w.sets || 0} x ${w.reps || 0}`,
    `${w.weightLifted || 0} ${user?.unitPreference || 'KG'}`,
    `${w.duration || 0}m`,
    `${w.caloriesBurned || 0} kcal`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Exercise', 'Category', 'Sets/Reps', 'Weight', 'Duration', 'Calories']],
    body: workoutTableData.length ? workoutTableData : [['No records', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 12;

  // If page is getting full, add page
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Nutrition Intake Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Recent Nutrition Entries', 14, yPos);
  yPos += 4;

  const nutritionTableData = nutrition.slice(0, 8).map(n => [
    n.date || '-',
    n.mealType || '-',
    n.foodName || '-',
    `${n.calories || 0} kcal`,
    `${n.protein || 0}g`,
    `${n.carbs || 0}g`,
    `${n.fats || 0}g`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Meal', 'Food Item', 'Calories', 'Protein', 'Carbs', 'Fats']],
    body: nutritionTableData.length ? nutritionTableData : [['No records', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' }, // purple
    styles: { fontSize: 8, cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 12;

  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Progress Logs Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Body & Performance Progress History', 14, yPos);
  yPos += 4;

  const progressTableData = progress.slice(0, 6).map(p => [
    p.date || '-',
    `${p.weight || '-'} ${user?.unitPreference || 'KG'}`,
    p.bodyFat ? `${p.bodyFat}%` : '-',
    p.waist ? `${p.waist}cm` : '-',
    p.chest ? `${p.chest}cm` : '-',
    p.deadliftMax ? `${p.deadliftMax}kg` : '-',
    p.runningTime5k ? `${p.runningTime5k}m` : '-'
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Weight', 'Body Fat', 'Waist', 'Chest', 'Deadlift 1RM', '5k Run']],
    body: progressTableData.length ? progressTableData : [['No records', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: [15, 23, 42], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`PulseFit Platform - Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  doc.save(`PulseFit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
