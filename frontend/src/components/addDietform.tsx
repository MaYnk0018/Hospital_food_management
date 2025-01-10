import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMeal, IMealItem } from '../types/dashboard';

const mealItemSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  specialInstructions: z.array(z.string())
});

const mealSchema = z.object({
  items: z.array(mealItemSchema),
  status: z.enum(["pending", "preparing", "delivered"])
});

const dietSchema = z.object({
  date: z.date(),
  meals: z.object({
    morning: mealSchema,
    evening: mealSchema,
    night: mealSchema
  })
});

interface AddDietFormProps {
  patientId: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const AddDietForm: React.FC<AddDietFormProps> = ({ patientId, onSubmit, onClose }) => {
  const form = useForm({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      date: new Date(),
      meals: {
        morning: {
          items: [{ name: '', ingredients: [], specialInstructions: [] }],
          status: 'pending' as const
        },
        evening: {
          items: [{ name: '', ingredients: [], specialInstructions: [] }],
          status: 'pending' as const
        },
        night: {
          items: [{ name: '', ingredients: [], specialInstructions: [] }],
          status: 'pending' as const
        }
      }
    }
  });

  const addMealItem = (mealTime: 'morning' | 'evening' | 'night') => {
    const currentItems = form.getValues(`meals.${mealTime}.items`);
    form.setValue(`meals.${mealTime}.items`, [
      ...currentItems,
      { name: '', ingredients: [], specialInstructions: [] }
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {(['morning', 'evening', 'night'] as const).map((mealTime) => (
          <div key={mealTime} className="space-y-4">
            <h3 className="font-medium capitalize">{mealTime} Meal</h3>
            {form.getValues(`meals.${mealTime}.items`).map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`meals.${mealTime}.items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`meals.${mealTime}.items.${index}.ingredients`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value.join(', ')}
                          onChange={e => field.onChange(e.target.value.split(',').map(i => i.trim()))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`meals.${mealTime}.items.${index}.specialInstructions`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value.join('\n')}
                          onChange={e => field.onChange(e.target.value.split('\n').filter(Boolean))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addMealItem(mealTime)}
            >
              Add Another Item
            </Button>
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Diet Plan
          </Button>
        </div>
      </form>
    </Form>
  );
};