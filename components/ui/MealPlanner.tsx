import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../services/api';
import { Meal } from '../../types';
import MealCard from './MealCard';

// Assume process.env.API_KEY is available
declare var process: any;

interface DailyPlan {
  day: string;
  meals: {
    mealName: string;
    reason: string;
  }[];
}

interface AIResponse {
  weeklyPlan: DailyPlan[];
}

const MealPlanner: React.FC = () => {
  const { t, language } = useLanguage();

  // Form state
  const [calories, setCalories] = useState('2000');
  const [diet, setDiet] = useState('noDiet');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [numMeals, setNumMeals] = useState('3');
  
  // API and result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);

  // Tab state for results
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    api.fetchMeals().then(setAllMeals);
  }, []);

  const handleAllergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAllergies(prev => [...prev, value]);
    } else {
      setAllergies(prev => prev.filter(allergy => allergy !== value));
    }
  };

  const generatePlan = async () => {
    if (!process.env.API_KEY) {
      setError("API key is not configured. Please contact support.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const mealList = allMeals.map(m => ({ 
        name: language === 'en' ? m.name_en : m.name_ar, 
        kcal: m.kcal, 
        protein: m.protein, 
        carbs: m.carbs, 
        fat: m.fat 
    }));
    
    const prompt = `You are a diet planner for a healthy food restaurant. Based on the user's preferences and the available meal list, create a 7-day meal plan.

User Preferences:
- Target Daily Calories: ${calories}
- Diet Type: ${diet}
- Allergies to avoid: ${allergies.length > 0 ? allergies.join(', ') : 'none'}
- Meals per day: ${numMeals}

Available Meals (JSON format):
${JSON.stringify(mealList)}

Respond with a JSON object that strictly follows the provided schema. The mealName must exactly match one of the names from the provided available meals list. Provide a brief 'reason' for each choice in one sentence. The total calories for each day should be as close as possible to the user's target.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weeklyPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    meals: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          mealName: { type: Type.STRING },
                          reason: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const parsedResponse: AIResponse = JSON.parse(response.text);
      setResult(parsedResponse);
    } catch (e) {
      console.error(e);
      setError(t('planError'));
    } finally {
      setLoading(false);
    }
  };

  const findMealByName = (name: string): Meal | undefined => {
    const normalizedName = name.trim().toLowerCase();
    return allMeals.find(meal => 
      meal.name_en.trim().toLowerCase() === normalizedName ||
      meal.name_ar.trim().toLowerCase() === normalizedName
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-surface rounded-2xl shadow-md p-6 md:p-8 mb-12">
        <form onSubmit={(e) => { e.preventDefault(); generatePlan(); }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-text-primary mb-1">{t('caloriesTarget')}</label>
              <input type="number" id="calories" value={calories} onChange={e => setCalories(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required />
            </div>
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-text-primary mb-1">{t('dietType')}</label>
              <select id="diet" value={diet} onChange={e => setDiet(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                <option value="noDiet">{t('noDiet')}</option>
                <option value="vegetarian">{t('vegetarian')}</option>
                <option value="vegan">{t('vegan')}</option>
                <option value="glutenFree">{t('glutenFree')}</option>
              </select>
            </div>
             <div>
              <label htmlFor="numMeals" className="block text-sm font-medium text-text-primary mb-1">{t('mealsPerDayForm')}</label>
              <select id="numMeals" value={numMeals} onChange={e => setNumMeals(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">{t('allergies')}</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['nuts', 'dairy', 'seafood'].map(allergy => (
                <label key={allergy} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input type="checkbox" value={allergy} onChange={handleAllergyChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-text-secondary">{t(allergy as 'nuts' | 'dairy' | 'seafood')}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || allMeals.length === 0} className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? t('generatingPlan') : t('generatePlan')}
          </button>
        </form>
      </div>

      {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-4xl mx-auto mb-8">{error}</div>}
      
      {result && result.weeklyPlan && (
        <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 rtl:space-x-reverse overflow-x-auto" aria-label="Tabs">
                    {result.weeklyPlan.map((dayPlan, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                                activeTab === index
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            aria-current={activeTab === index ? 'page' : undefined}
                        >
                            {t('day')} {index + 1}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="py-8">
                {result.weeklyPlan.map((dayPlan, index) => (
                    <div key={index} style={{ display: activeTab === index ? 'block' : 'none' }}>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                           {dayPlan.meals.map((mealItem, mealIndex) => {
                               const mealData = findMealByName(mealItem.mealName);
                               return mealData ? (
                                   <MealCard key={`${index}-${mealIndex}`} meal={mealData} />
                               ) : (
                                   <div key={`${index}-${mealIndex}`} className="p-4 border rounded-lg bg-gray-50">
                                       <p className="font-bold">{mealItem.mealName}</p>
                                       <p className="text-sm text-red-500">(Meal not found in current menu)</p>
                                   </div>
                               );
                           })}
                       </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </>
  );
};

export default MealPlanner;