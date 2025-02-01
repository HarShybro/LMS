import { Model, Document } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generate12MonthsData<
  T extends Document & { createdAt: Date }
>(model: Model<T>): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  for (let i = 11; i >= 0; i--) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28,
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 28,
      0
    );

    const monthYear = startDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    last12Months.push({ month: monthYear, count });
  }

  return { last12Months };
}
