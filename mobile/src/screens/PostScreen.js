import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  X, Image as ImageIcon, Camera, ArrowLeft, Trophy, Flame, 
  RefreshCw, Target, Clapperboard, Globe, Users, Building, Leaf, CheckCircle2,
  Calendar, ChevronRight, Sparkles, Video, FolderUp, Activity, Timer, Zap
} from 'lucide-react-native';
import { PostContext } from '../context/PostContext';

export default function PostScreen({ navigation }) {
  const { addPost } = useContext(PostContext);
  const [step, setStep] = useState(0); 
  const [postType, setPostType] = useState(null); 
  
  // Milestone state
  const [category, setCategory] = useState('streak'); 
  const [achievement, setAchievement] = useState('');
  const [story, setStory] = useState('');
  const [streakDays, setStreakDays] = useState('1');
  const [visibility, setVisibility] = useState('public');
  const [gym, setGym] = useState("Gold's Gym");
  const [city, setCity] = useState("Mumbai");
  const [mediaUri, setMediaUri] = useState(null);

  // Gainclip state
  const [gcCategory, setGcCategory] = useState('pr');
  const [gcTitle, setGcTitle] = useState('');
  const [gcCaption, setGcCaption] = useState('');

  // Formcheck state
  const [fcCategory, setFcCategory] = useState('pr');
  const [fcTitle, setFcTitle] = useState('');
  const [fcCaption, setFcCaption] = useState('');

  const openCamera = async (isMediaVideo = false) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: isMediaVideo ? ['videos'] : ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setMediaUri(result.assets[0].uri);
  };

  const openGallery = async (isMediaVideo = false) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isMediaVideo ? ['videos'] : ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setMediaUri(result.assets[0].uri);
  };

  const closePost = () => {
    navigation.navigate('Home');
    setStep(0);
    setPostType(null);
  };

  const TopBar = ({ currentStep, totalSteps, title, color = '#22C55E' }) => {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (step === 1) setPostType(null);
          setStep(step - 1);
        }}>
          <ArrowLeft color="#9CA3AF" size={20} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {totalSteps > 1 ? (
            [1, 2, 3, 4].map((s) => (
              <View 
                key={s} 
                style={[styles.progressSegment, s <= currentStep && { backgroundColor: color }]} 
              />
            ))
          ) : (
            <View style={[styles.progressSegment, { backgroundColor: color }]} />
          )}
        </View>
        <Text style={styles.stepText}>{title || `${currentStep}/${totalSteps}`}</Text>
      </View>
    );
  };

  const renderOptions = () => (
    <View style={styles.screenWrapper}>
      <View style={styles.optionsHeader}>
        <View>
          <Text style={styles.screenTitle}>Create Post</Text>
          <Text style={styles.screenSubtitle}>What are you sharing today?</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={closePost}>
          <X color="#9CA3AF" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsGrid}>
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#064E3B' }]} 
          onPress={() => { setPostType('milestone'); setStep(1); }}
        >
          <Camera color="#A7F3D0" size={28} />
          <Text style={styles.optionTitle}>Milestone Post</Text>
          <Text style={styles.optionSubtitle}>Share an achievement</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#451A03' }]}
          onPress={() => { setPostType('gainclip'); setStep(1); }}
        >
          <Clapperboard color="#FCD34D" size={28} />
          <Text style={styles.optionTitle}>GainClip</Text>
          <Text style={styles.optionSubtitle}>Short video (max 60 sec)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#312E81' }]}
          onPress={() => { setPostType('transformation'); setStep(1); }}
        >
          <RefreshCw color="#A5B4FC" size={28} />
          <Text style={styles.optionTitle}>Transformation</Text>
          <Text style={styles.optionSubtitle}>Before & after</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#083344' }]}
          onPress={() => { setPostType('formcheck'); setStep(1); }}
        >
          <Target color="#67E8F9" size={28} />
          <Text style={styles.optionTitle}>Form Check</Text>
          <Text style={styles.optionSubtitle}>Get feedback on your form</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddMedia = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={1} totalSteps={4} />
      <Text style={styles.stepTitle}>Milestone — Add Media</Text>

      <View style={styles.dashedBox}>
        <View style={styles.dashedBoxInner}>
          <ImageIcon color="#4B5563" size={32} style={{ marginBottom: 12 }} />
          <Text style={styles.dashedBoxTitle}>Tap to add photos or video</Text>
          <Text style={styles.dashedBoxSubtitle}>JPG, PNG · max 10 MB · up to 5 photos</Text>
          
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionPill} onPress={() => openCamera()}>
              <Camera color="#9CA3AF" size={16} />
              <Text style={styles.actionPillText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill} onPress={() => openGallery()}>
              <ImageIcon color="#9CA3AF" size={16} />
              <Text style={styles.actionPillText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          
          {mediaUri && (
             <Text style={[styles.helperText, { color: '#22C55E', marginTop: 12 }]}>✓ Media attached successfully</Text>
          )}
        </View>
      </View>

      <Text style={styles.helperText}>Media is optional — you can post text only ✍️</Text>

      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
        <Text style={styles.primaryButtonText}>Continue  &gt;</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGainClip = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={1} totalSteps={1} title="GainClip" color="#EA580C" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.transHeaderRow}>
          <Clapperboard color="#A78BFA" size={20} />
          <Text style={styles.stepTitleTrans}>GainClip</Text>
        </View>
        <Text style={styles.stepSubtitleTrans}>Upload a short video - max 60 seconds - max 200 MB</Text>

        <View style={[styles.dashedBox, { height: 280, backgroundColor: '#111827' }]}>
          <View style={styles.dashedBoxInner}>
            <View style={{ 
              backgroundColor: '#1F2937', padding: 16, borderRadius: 32, marginBottom: 12
            }}>
              <Video color="#6B7280" size={32} />
            </View>
            <Text style={styles.dashedBoxTitle}>Tap to upload video</Text>
            <Text style={styles.dashedBoxSubtitle}>MP4, MOV - max 200 MB</Text>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.actionPill} onPress={() => openCamera(true)}>
                <Video color="#C084FC" size={16} />
                <Text style={styles.actionPillText}>Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionPill} onPress={() => openGallery(true)}>
                <FolderUp color="#FCD34D" size={16} />
                <Text style={styles.actionPillText}>Upload</Text>
              </TouchableOpacity>
            </View>
            
            {mediaUri && (
               <Text style={[styles.helperText, { color: '#EA580C', marginTop: 12 }]}>✓ Video attached successfully</Text>
            )}
          </View>
        </View>

        <Text style={styles.inputLabel}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity 
            style={[styles.categoryPill, gcCategory === 'pr' && { borderColor: '#EA580C' }]}
            onPress={() => setGcCategory('pr')}
          >
            <Trophy color="#F59E0B" size={14} />
            <Text style={styles.categoryText}>PR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryPill, gcCategory === 'bodyweight' && { borderColor: '#EA580C' }]}
            onPress={() => setGcCategory('bodyweight')}
          >
            <Activity color="#F97316" size={14} />
            <Text style={styles.categoryText}>Bodyweight</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, gcCategory === 'endurance' && { borderColor: '#EA580C' }]}
            onPress={() => setGcCategory('endurance')}
          >
            <Timer color="#FCD34D" size={14} />
            <Text style={styles.categoryText}>Endurance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, gcCategory === 'general' && { borderColor: '#EA580C' }]}
            onPress={() => setGcCategory('general')}
          >
            <Zap color="#FCA5A5" size={14} />
            <Text style={styles.categoryText}>General</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.inputLabel}>TITLE *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="DEADLIFT 200KG ATTEMPT 💀"
            placeholderTextColor="#4B5563"
            value={gcTitle}
            onChangeText={setGcTitle}
          />
        </View>

        <Text style={styles.inputLabel}>CAPTION <Text style={{ color: '#4B5563' }}>(optional)</Text></Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Tell the story behind this clip... 🔥"
            placeholderTextColor="#4B5563"
            multiline
            value={gcCaption}
            onChangeText={setGcCaption}
          />
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#9A3412', marginTop: 8 }]} onPress={() => {
          addPost({
            id: Date.now().toString(),
            user: 'You',
            avatarLetters: 'Y',
            location: 'Home Gym',
            timeAgo: 'Just now',
            title: gcTitle,
            content: gcCaption,
            media: mediaUri,
            badgeName: 'GAINCLIP POSTED'
          });
          closePost();
        }}>
          <Text style={[styles.primaryButtonText, { color: '#FFEDD5' }]}>🎬 Post GainClip</Text>
        </TouchableOpacity>
        <View style={{height: 30}}/>
      </ScrollView>
    </View>
  );

  const renderFormCheck = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={1} totalSteps={1} title="Form Check" color="#EA580C" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.transHeaderRow}>
          <Target color="#F43F5E" size={20} />
          <Text style={styles.stepTitleTrans}>Form Check</Text>
        </View>
        <Text style={styles.stepSubtitleTrans}>Upload your form and get feedback from the community</Text>

        <View style={[styles.dashedBox, { height: 280, backgroundColor: '#111827' }]}>
          <View style={styles.dashedBoxInner}>
            <View style={{ 
              backgroundColor: '#1F2937', padding: 16, borderRadius: 32, marginBottom: 12
            }}>
              <Video color="#6B7280" size={32} />
            </View>
            <Text style={styles.dashedBoxTitle}>Tap to upload video</Text>
            <Text style={styles.dashedBoxSubtitle}>MP4, MOV - max 200 MB</Text>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.actionPill} onPress={() => openCamera(true)}>
                <Video color="#C084FC" size={16} />
                <Text style={styles.actionPillText}>Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionPill} onPress={() => openGallery(true)}>
                <FolderUp color="#FCD34D" size={16} />
                <Text style={styles.actionPillText}>Upload</Text>
              </TouchableOpacity>
            </View>
            
            {mediaUri && (
               <Text style={[styles.helperText, { color: '#EA580C', marginTop: 12 }]}>✓ Video attached successfully</Text>
            )}
          </View>
        </View>

        <Text style={styles.inputLabel}>CATEGORY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity 
            style={[styles.categoryPill, fcCategory === 'pr' && { borderColor: '#EA580C' }]}
            onPress={() => setFcCategory('pr')}
          >
            <Trophy color="#F59E0B" size={14} />
            <Text style={styles.categoryText}>PR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryPill, fcCategory === 'bodyweight' && { borderColor: '#EA580C' }]}
            onPress={() => setFcCategory('bodyweight')}
          >
            <Activity color="#F97316" size={14} />
            <Text style={styles.categoryText}>Bodyweight</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, fcCategory === 'endurance' && { borderColor: '#EA580C' }]}
            onPress={() => setFcCategory('endurance')}
          >
            <Timer color="#FCD34D" size={14} />
            <Text style={styles.categoryText}>Endurance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, fcCategory === 'general' && { borderColor: '#EA580C' }]}
            onPress={() => setFcCategory('general')}
          >
            <Zap color="#FCA5A5" size={14} />
            <Text style={styles.categoryText}>General</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.inputLabel}>TITLE *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Check my squat form 🎯"
            placeholderTextColor="#4B5563"
            value={fcTitle}
            onChangeText={setFcTitle}
          />
        </View>

        <Text style={styles.inputLabel}>CAPTION <Text style={{ color: '#4B5563' }}>(optional)</Text></Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Describe what you want feedback on — depth, form, bracing..."
            placeholderTextColor="#4B5563"
            multiline
            value={fcCaption}
            onChangeText={setFcCaption}
          />
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#8B4513', marginTop: 8 }]} onPress={() => {
          addPost({
            id: Date.now().toString(),
            user: 'You',
            avatarLetters: 'Y',
            location: 'Home Gym',
            timeAgo: 'Just now',
            title: fcTitle,
            content: fcCaption,
            media: mediaUri,
            badgeName: 'FORM CHECK'
          });
          closePost();
        }}>
          <Text style={[styles.primaryButtonText, { color: '#FFEDD5' }]}>🎯 Post Form Check</Text>
        </TouchableOpacity>
        <View style={{height: 30}}/>
      </ScrollView>
    </View>
  );

  const renderTransformation = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={1} totalSteps={1} title="Transformation" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.transHeaderRow}>
          <RefreshCw color="#3B82F6" size={20} />
          <Text style={styles.stepTitleTrans}>Before & After</Text>
        </View>
        <Text style={styles.stepSubtitleTrans}>Show the world your transformation journey</Text>

        <View style={styles.beforeAfterContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginTop: 0 }]}>BEFORE</Text>
            <TouchableOpacity style={styles.halfDashedBox} onPress={() => openGallery()}>
              <Calendar color="#A5B4FC" size={24} style={{ marginBottom: 8 }} />
              <Text style={styles.dashedBoxSubtitle}>Tap to upload</Text>
              <View style={styles.tinyGalleryBtn}><ImageIcon color="#6B7280" size={12} /></View>
            </TouchableOpacity>
          </View>

          <View style={styles.chevronDivider}>
            <View style={styles.circleChevron}><ChevronRight color="#4B5563" size={14} /></View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginTop: 0 }]}>AFTER</Text>
            <TouchableOpacity style={styles.halfDashedBox} onPress={() => openGallery()}>
              <Flame color="#F97316" size={24} style={{ marginBottom: 8 }} />
              <Text style={styles.dashedBoxSubtitle}>Tap to upload</Text>
              <View style={styles.tinyGalleryBtn}><ImageIcon color="#6B7280" size={12} /></View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>BEFORE DATE</Text>
            <View style={styles.inputIconWrapper}>
              <TextInput style={styles.textInputWithIcon} placeholder="dd-mm-yyyy" placeholderTextColor="#4B5563" />
              <Calendar color="#9CA3AF" size={16} />
            </View>
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>AFTER DATE</Text>
            <View style={styles.inputIconWrapper}>
              <TextInput style={styles.textInputWithIcon} placeholder="dd-mm-yyyy" placeholderTextColor="#4B5563" />
              <Calendar color="#9CA3AF" size={16} />
            </View>
          </View>
        </View>

        <Text style={styles.inputLabel}>TITLE *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="My Transformation Journey ✨"
            placeholderTextColor="#4B5563"
          />
        </View>

        <Text style={styles.inputLabel}>TELL YOUR STORY <Text style={{ color: '#4B5563' }}>(optional)</Text></Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Share your journey — the highs, the lows, what changed... 💪"
            placeholderTextColor="#4B5563"
            multiline
          />
          <Text style={styles.charCount}>0/2000</Text>
        </View>

        <View style={styles.badgeEarnedCard}>
          <Sparkles color="#FCD34D" size={28} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.badgeEarnedPretitle}>YOU'LL EARN</Text>
            <Text style={styles.badgeEarnedTitle}>Glow Up badge</Text>
            <Text style={styles.badgeEarnedPoints}>+150 GP</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#166534' }]} onPress={() => {
          addPost({
            id: Date.now().toString(),
            user: 'You',
            avatarLetters: 'Y',
            location: 'Home Gym',
            timeAgo: 'Just now',
            title: 'TRANSFORMATION',
            content: 'Just posted a new transformation!',
            badgeName: 'GLOW UP BADGE'
          });
          closePost();
        }}>
          <Text style={[styles.primaryButtonText, { color: '#A7F3D0' }]}>🚀 Post Transformation</Text>
        </TouchableOpacity>
        <View style={{height: 30}}/>
      </ScrollView>
    </View>
  );

  const renderAchievementDetails = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={2} totalSteps={4} />
      <Text style={styles.stepTitle}>Milestone — Achievement Details</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={styles.inputLabel}>ACHIEVEMENT CATEGORY *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity 
            style={[styles.categoryPill, category === 'pr' && styles.categoryPillActive]}
            onPress={() => setCategory('pr')}
          >
            <Trophy color="#F59E0B" size={14} />
            <Text style={styles.categoryText}>Personal Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryPill, category === 'streak' && styles.categoryPillActive]}
            onPress={() => setCategory('streak')}
          >
            <Flame color="#F97316" size={14} />
            <Text style={styles.categoryText}>Streak</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryPill, category === 'transformation' && styles.categoryPillActive]}
            onPress={() => setCategory('transformation')}
          >
            <RefreshCw color="#3B82F6" size={14} />
            <Text style={styles.categoryText}>Transformation</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.inputLabel}>WHAT DID YOU ACHIEVE? *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 140KG DEADLIFT — NEW PR! 🔥"
            placeholderTextColor="#4B5563"
            value={achievement}
            onChangeText={setAchievement}
          />
          <Text style={styles.charCount}>{achievement.length}/200</Text>
        </View>

        <Text style={styles.inputLabel}>TELL YOUR STORY <Text style={{ color: '#4B5563' }}>(optional)</Text></Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Share the journey, the grind, the moment... 💪"
            placeholderTextColor="#4B5563"
            multiline
            value={story}
            onChangeText={setStory}
          />
          <Text style={styles.charCount}>{story.length}/2000</Text>
        </View>

        {category === 'streak' && (
          <View style={styles.streakDetailsBox}>
            <View style={styles.streakHeader}>
              <Flame color="#F97316" size={14} />
              <Text style={styles.streakTitle}>STREAK DETAILS</Text>
            </View>
            <Text style={styles.streakInputLabel}>NUMBER OF DAYS</Text>
            <TextInput
              style={styles.streakInput}
              keyboardType="numeric"
              value={streakDays}
              onChangeText={setStreakDays}
            />
            <View style={styles.streakFooter}>
              <Flame color="#F97316" size={12} />
              <Text style={styles.streakFooterText}>{streakDays || 0} day streak — absolute beast mode!</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(3)}>
        <Text style={styles.primaryButtonText}>Continue  &gt;</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.screenWrapper}>
      <TopBar currentStep={3} totalSteps={4} />
      <Text style={styles.stepTitle}>Milestone — Settings</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={styles.inputLabel}>WHO CAN SEE THIS?</Text>
        
        <View style={styles.visibilityList}>
          <TouchableOpacity 
            style={[styles.visibilityOption, visibility === 'public' && styles.visibilityOptionActive]}
            onPress={() => setVisibility('public')}
          >
            <Globe color={visibility === 'public' ? "#22C55E" : "#9CA3AF"} size={20} />
            <View style={styles.visibilityTextContainer}>
              <Text style={styles.visibilityTitle}>Public</Text>
              <Text style={styles.visibilityDesc}>Everyone can see</Text>
            </View>
            {visibility === 'public' && <CheckCircle2 color="#22C55E" size={20} style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.visibilityOption, visibility === 'followers' && styles.visibilityOptionActive]}
            onPress={() => setVisibility('followers')}
          >
            <Users color={visibility === 'followers' ? "#22C55E" : "#9CA3AF"} size={20} />
            <View style={styles.visibilityTextContainer}>
              <Text style={styles.visibilityTitle}>Followers Only</Text>
              <Text style={styles.visibilityDesc}>People you follow</Text>
            </View>
            {visibility === 'followers' && <CheckCircle2 color="#22C55E" size={20} style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.visibilityOption, visibility === 'gym' && styles.visibilityOptionActive]}
            onPress={() => setVisibility('gym')}
          >
            <Building color={visibility === 'gym' ? "#22C55E" : "#9CA3AF"} size={20} />
            <View style={styles.visibilityTextContainer}>
              <Text style={styles.visibilityTitle}>My Gym Only</Text>
              <Text style={styles.visibilityDesc}>Your gym members</Text>
            </View>
            {visibility === 'gym' && <CheckCircle2 color="#22C55E" size={20} style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.visibilityOption, visibility === 'beginners' && styles.visibilityOptionActive]}
            onPress={() => setVisibility('beginners')}
          >
            <Leaf color={visibility === 'beginners' ? "#22C55E" : "#9CA3AF"} size={20} />
            <View style={styles.visibilityTextContainer}>
              <Text style={styles.visibilityTitle}>Beginners Feed</Text>
              <Text style={styles.visibilityDesc}>New gym-goers only</Text>
            </View>
            {visibility === 'beginners' && <CheckCircle2 color="#22C55E" size={20} style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>
        </View>

        <Text style={[styles.inputLabel, { marginTop: 8 }]}>TAG GYM</Text>
        <TextInput
          style={styles.textInput}
          value={gym}
          onChangeText={setGym}
        />

        <Text style={styles.inputLabel}>CITY <Text style={{ color: '#4B5563' }}>(optional)</Text></Text>
        <TextInput
          style={styles.textInput}
          value={city}
          onChangeText={setCity}
        />
      </ScrollView>

      <TouchableOpacity style={styles.primaryButton} onPress={() => {
          addPost({
            id: Date.now().toString(),
            user: 'You',
            avatarLetters: 'Y',
            location: `${gym}, ${city}`,
            timeAgo: 'Just now',
            title: achievement,
            content: story,
            media: mediaUri,
            badgeName: category === 'streak' ? `${streakDays} DAY STREAK🔥` : 'NEW MILESTONE'
          });
          closePost();
      }}>
        <Text style={styles.primaryButtonText}>Post Milestone  &gt;</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {step === 0 && renderOptions()}
        {step === 1 && postType === 'milestone' && renderAddMedia()}
        {step === 1 && postType === 'transformation' && renderTransformation()}
        {step === 1 && postType === 'gainclip' && renderGainClip()}
        {step === 1 && postType === 'formcheck' && renderFormCheck()}
        {step === 2 && renderAchievementDetails()}
        {step === 3 && renderSettings()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  screenWrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F0F0F',
  },
  // Options
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 20,
  },
  screenTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  screenSubtitle: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  closeBtn: {
    borderWidth: 1, borderColor: '#1F2937', borderRadius: 8, padding: 6, backgroundColor: '#111827',
  },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  optionCard: {
    width: '47%', aspectRatio: 1.1, borderRadius: 12, padding: 16, justifyContent: 'center',
  },
  optionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  optionSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  
  // TopBar
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  backBtn: {
    borderWidth: 1, borderColor: '#1F2937', borderRadius: 8, padding: 6, backgroundColor: '#111827', marginRight: 16,
  },
  progressContainer: { flex: 1, flexDirection: 'row', gap: 8, marginRight: 16 },
  progressSegment: { flex: 1, height: 4, backgroundColor: '#1F2937', borderRadius: 2 },
  progressSegmentActive: { backgroundColor: '#22C55E' },
  stepText: { color: '#6B7280', fontSize: 12 },
  stepTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 24 },

  // Add Media
  dashedBox: {
    borderWidth: 1, borderColor: '#374151', borderStyle: 'dashed', borderRadius: 12, padding: 24,
    backgroundColor: '#111827', alignItems: 'center', height: 250, justifyContent: 'center',
  },
  dashedBoxInner: { alignItems: 'center' },
  dashedBoxTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  dashedBoxSubtitle: { color: '#6B7280', fontSize: 12, marginBottom: 20 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  actionPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingVertical: 8,
    paddingHorizontal: 16, borderRadius: 20, gap: 6,
  },
  actionPillText: { color: '#9CA3AF', fontSize: 12 },
  helperText: { color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 16 },

  // Transformation & GainClip Shared
  transHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  stepTitleTrans: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  stepSubtitleTrans: { color: '#6B7280', fontSize: 12, marginBottom: 24 },
  beforeAfterContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  halfDashedBox: {
    borderWidth: 1, borderColor: '#374151', borderStyle: 'dashed', borderRadius: 8,
    backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingVertical: 32,
  },
  chevronDivider: { paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  circleChevron: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center'
  },
  tinyGalleryBtn: {
    marginTop: 8, padding: 6, borderRadius: 4, backgroundColor: '#1F2937'
  },
  datesRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  halfInputContainer: { flex: 1 },
  inputIconWrapper: { position: 'relative', justifyContent: 'center' },
  textInputWithIcon: {
    backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 8,
    padding: 14, color: '#F9FAFB', fontSize: 14, paddingRight: 40
  },
  badgeEarnedCard: {
    flexDirection: 'row', backgroundColor: '#2E1065', borderRadius: 8, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: '#4C1D95', marginTop: 8, marginBottom: 16,
  },
  badgeEarnedPretitle: { color: '#A78BFA', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  badgeEarnedTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  badgeEarnedPoints: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold' },

  // Details
  inputLabel: { color: '#6B7280', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  categoryScroll: { flexDirection: 'row', marginBottom: 16 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1F2937', backgroundColor: '#111827',
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, gap: 8,
  },
  categoryPillActive: { borderColor: '#22C55E' },
  categoryText: { color: '#9CA3AF', fontSize: 14 },
  inputWrapper: { marginBottom: 16 },
  textInput: {
    backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 8,
    padding: 16, color: '#F9FAFB', fontSize: 14,
  },
  charCount: { color: '#4B5563', fontSize: 10, textAlign: 'right', marginTop: 4 },
  streakDetailsBox: {
    backgroundColor: '#1D1305', borderWidth: 1, borderColor: '#432C11', borderRadius: 8,
    padding: 16, marginTop: 16, marginBottom: 32,
  },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  streakTitle: { color: '#F97316', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  streakInputLabel: { color: '#A8A29E', fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  streakInput: {
    backgroundColor: '#0F0F0F', borderWidth: 1, borderColor: '#292524', borderRadius: 8,
    color: '#FFFFFF', fontSize: 16, padding: 12, fontWeight: 'bold', marginBottom: 12,
  },
  streakFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakFooterText: { color: '#A8A29E', fontSize: 11 },

  // Settings
  visibilityList: { marginBottom: 16 },
  visibilityOption: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderWidth: 1,
    borderColor: '#1F2937', padding: 16, borderRadius: 8, marginBottom: 8, gap: 16,
  },
  visibilityOptionActive: { borderColor: '#22C55E' },
  visibilityTextContainer: { flex: 1 },
  visibilityTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  visibilityDesc: { color: '#9CA3AF', fontSize: 12 },

  // Common
  primaryButton: { backgroundColor: '#22C55E', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
