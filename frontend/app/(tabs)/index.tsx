import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { CheckCircle, Circle, Edit2, Trash2, Plus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { api, Todo } from '@/lib/api';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await api.todos.getAll(token);
      setTodos(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!token || !newTodoTitle.trim()) return;

    try {
      const newTodo = await api.todos.create(token, newTodoTitle.trim());
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!token) return;

    try {
      const updatedTodo = await api.todos.toggleComplete(
        token,
        todo.id,
        !todo.completed
      );
      setTodos(
        todos.map((t) => (t.id === todo.id ? updatedTodo : t))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleEditTodo = async () => {
    if (!token || !editingTodo || !editTitle.trim()) return;

    try {
      const updatedTodo = await api.todos.update(token, editingTodo.id, {
        title: editTitle.trim(),
      });
      setTodos(
        todos.map((t) => (t.id === editingTodo.id ? updatedTodo : t))
      );
      setEditingTodo(null);
      setEditTitle('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!token) return;

    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.todos.delete(token, todoId);
              setTodos(todos.filter((t) => t.id !== todoId));
              setError('');
            } catch (err: any) {
              setError(err.message || 'Failed to delete todo');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoLeft}
        onPress={() => handleToggleComplete(item)}
      >
        {item.completed ? (
          <CheckCircle size={24} color="#FFD600" strokeWidth={2} />
        ) : (
          <Circle size={24} color="#999" strokeWidth={2} />
        )}
        <Text
          style={[
            styles.todoText,
            item.completed && styles.todoTextCompleted,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.todoActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Edit2 size={18} color="#666" strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteTodo(item.id)}
        >
          <Trash2 size={18} color="#FF3B30" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD600" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>
          {todos.filter((t) => !t.completed).length} tasks remaining
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Plus size={24} color="#000" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>
              Add your first task to get started
            </Text>
          </View>
        }
      />

      <Modal
        visible={editingTodo !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingTodo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditingTodo(null)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleEditTodo}
              >
                <Text style={styles.modalButtonTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#FFD600',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  todoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginHorizontal: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft: 12,
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  modalButtonSave: {
    backgroundColor: '#FFD600',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
