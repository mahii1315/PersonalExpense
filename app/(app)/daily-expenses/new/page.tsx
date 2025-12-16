import { getCategories } from "@/app/actions/expenses";
import { DailyExpenseForm } from "@/components/expenses/DailyExpenseForm";

export default async function NewDailyExpensePage() {
    const categories = await getCategories();

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add Daily Expense</h1>
            <DailyExpenseForm categories={categories} />
        </div>
    );
}
