import { getCategories } from "@/app/actions/expenses";
import { RecurringExpenseForm } from "@/components/expenses/RecurringExpenseForm";

export default async function NewRecurringExpensePage() {
    const categories = await getCategories();

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add Recurring Expense</h1>
            <RecurringExpenseForm categories={categories} />
        </div>
    );
}
