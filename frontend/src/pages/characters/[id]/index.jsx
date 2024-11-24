import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../utils/api'

export default function CharacterDetail() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, token } = useAuth()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editedDesc, setEditedDesc] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    const fetchCharacter = async () => {
      if (!id) return
      try {
        const response = await api.get(`/api/characters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCharacter(response.data)
        setEditedDesc(response.data.description || '')
      } catch (err) {
        setError('Failed to load character')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCharacter()
    }
  }, [id, isAuthenticated, token, router])

  const handleDescriptionEdit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      try {
        await api.patch(`/api/characters/${id}`, 
          { description: editedDesc },
          { headers: { Authorization: `Bearer ${token}` }}
        )
        setCharacter(prev => ({
          ...prev,
          description: editedDesc
        }))
        setIsEditingDesc(false)
      } catch (err) {
        console.error('Failed to update description:', err)
      }
    }
  }

  const calculateModifier = (value) => {
    return value >= 0 ? `+${value}` : value.toString()
  }

  if (loading) return <Layout><div className="container mx-auto p-4">Loading...</div></Layout>
  if (error) return <Layout><div className="container mx-auto p-4 text-red-500">{error}</div></Layout>
  if (!character) return <Layout><div className="container mx-auto p-4">Character not found</div></Layout>

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Character Image */}
          <div className="md:col-span-1">
            {character.image_path && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/media/${character.image_path}`}
                alt={character.name}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>
          
          {/* Basic Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">{character.name}</h1>
              
              {/* Experience Bar Section */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm text-[var(--color-text-secondary)]">
                  <span>Level {character.level}</span>
                  <span className="font-medium">
                    {character.experience}/{character.experience + character.experience_to_next_level} XP
                  </span>
                </div>
                <div className="relative w-full h-1.5">
                  <div className="absolute w-full h-full bg-[var(--color-bg-secondary)] rounded-full" />
                  <div 
                    className="absolute h-full transition-all duration-300 rounded-full bg-yellow-500/75"
                    style={{
                      width: `${(character.experience / (character.experience + character.experience_to_next_level)) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              {/* Health Bar Section */}
              <div className="space-y-1 mt-3">
                <div className="flex justify-between items-center text-sm text-[var(--color-text-secondary)]">
                  <span>HP</span>
                  <span className="font-medium">
                    {character.current_hit_points}/{character.hit_points} HP
                    {character.temp_hit_points > 0 && 
                      <span className="text-blue-400 ml-1">
                        (+{character.temp_hit_points})
                      </span>
                    }
                  </span>
                </div>
                <div className="relative w-full h-2">
                  <div className="absolute w-full h-full bg-[var(--color-bg-secondary)] rounded-full" />
                  <div 
                    className="absolute h-full transition-all duration-300 rounded-full bg-[var(--color-text-primary)] opacity-75"
                    style={{
                      width: `${(character.current_hit_points / character.hit_points) * 100}%`
                    }}
                  />
                  {character.temp_hit_points > 0 && (
                    <div 
                      className="absolute h-full bg-blue-400 opacity-50 transition-all duration-300 rounded-full"
                      style={{
                        width: `${(character.temp_hit_points / character.hit_points) * 100}%`,
                        left: `${(character.current_hit_points / character.hit_points) * 100}%`
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[var(--color-text-secondary)]">
                  Level {Math.ceil(character.proficiency_bonus / 2)} {character.race} {character.character_class}
                  {character.subclass && ` (${character.subclass})`}
                </p>
                <p className="text-[var(--color-text-secondary)]">{character.background}</p>
                <p className="text-[var(--color-text-secondary)]">{character.alignment}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)]">Size: {character.size}</p>
                <p className="text-[var(--color-text-secondary)]">Speed: {character.speed} ft.</p>
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
              <h3 className="font-bold mb-2 flex justify-between items-center">
                Description
                <button 
                  onClick={() => {
                    setIsEditingDesc(true)
                    setEditedDesc(character.description)
                  }}
                  className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  {!isEditingDesc && 'Edit'}
                </button>
              </h3>
              {isEditingDesc ? (
                <textarea
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  onKeyDown={handleDescriptionEdit}
                  onBlur={() => {
                    setIsEditingDesc(false)
                    setEditedDesc(character.description)
                  }}
                  className="w-full h-32 p-2 text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] 
                    border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-1 
                    focus:ring-[var(--color-accent)]"
                  placeholder="Enter character description..."
                  autoFocus
                />
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">{character.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Ability Scores */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ability Scores</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(character.ability_scores).map(([ability, score]) => (
                <div key={ability} className="text-center p-2 bg-[var(--color-bg-primary)] rounded">
                  <div className="text-sm uppercase">{ability}</div>
                  <div className="text-xl font-bold">{score}</div>
                  <div className="text-sm">{calculateModifier(character.ability_modifiers[ability])}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Combat</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Armor Class</span>
                <span className="font-bold">{character.armor_class}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Initiative</span>
                <span className="font-bold">{calculateModifier(character.initiative)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Hit Dice</span>
                <span className="font-bold">{character.hit_dice}</span>
              </div>
            </div>
          </div>

          {/* Saving Throws */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Saving Throws</h2>
            <div className="space-y-2">
              {Object.entries(character.saving_throws).map(([ability, data]) => (
                <div key={ability} className="flex justify-between">
                  <span className="capitalize">{ability}</span>
                  <span className={`${data.is_proficient ? 'text-green-500' : ''}`}>
                    {calculateModifier(data.total_bonus)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {Object.entries(character.skills).map(([skill, data]) => (
                <div key={skill} className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    {data.is_proficient && (
                      <span className="w-2 h-2 rounded-full bg-green-500"/>
                    )}
                    <span className="capitalize">
                      {skill.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </span>
                  <span className={`${data.is_proficient ? 'text-green-500' : ''} font-medium`}>
                    {calculateModifier(data.total_bonus)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/characters')}
            className="btn-secondary"
          >
            Back to Characters
          </button>
        </div>
      </div>
    </Layout>
  )
} 