import React from 'react';
import Input from './Input';
import Button from './Button';

interface Person {
  name: string;
  role: string;
  image?: string;
  contact?: string;
  organization?: string;
  _id?: string;
}

interface PeopleInvolvedInputProps {
  people: Person[];
  onChange: (people: Person[]) => void;
}

export default function PeopleInvolvedInput({ people, onChange }: PeopleInvolvedInputProps) {
  const addPerson = () => {
    onChange([...people, { name: '', role: '', image: '', contact: '', organization: '', _id: `temp-${Date.now()}` }]);
  };

  const removePerson = (index: number) => {
    onChange(people.filter((_, i) => i !== index));
  };

  const updatePerson = (index: number, field: keyof Person, value: string) => {
    const updated = people.map((person, i) =>
      i === index ? { ...person, [field]: value } : person
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">People Involved</label>
        <Button type="button" onClick={addPerson} variant="secondary" className="text-sm">
          + Add Person
        </Button>
      </div>

      {people.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-4">No people added yet</p>
      ) : (
        <div className="space-y-4">
          {[...people].reverse().map((person, index) => {
            const originalIndex = people.length - 1 - index;
            return (
            <div key={person._id || originalIndex} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Person {originalIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePerson(originalIndex)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Name *"
                  placeholder="e.g., John Doe"
                  value={person.name}
                  onChange={(e) => updatePerson(originalIndex, 'name', e.target.value)}
                />
                <Input
                  label="Role *"
                  placeholder="e.g., Contractor, Engineer"
                  value={person.role}
                  onChange={(e) => updatePerson(originalIndex, 'role', e.target.value)}
                />
              </div>

              <Input
                label="Organization (Optional)"
                placeholder="e.g., ABC Construction Ltd"
                value={person.organization || ''}
                onChange={(e) => updatePerson(originalIndex, 'organization', e.target.value)}
              />

              <Input
                label="Contact (Optional)"
                placeholder="e.g., +1234567890 or email@example.com"
                value={person.contact || ''}
                onChange={(e) => updatePerson(originalIndex, 'contact', e.target.value)}
              />

              <Input
                label="Image URL (Optional)"
                placeholder="e.g., https://example.com/image.jpg"
                value={person.image || ''}
                onChange={(e) => updatePerson(originalIndex, 'image', e.target.value)}
              />
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
