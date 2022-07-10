Current State는 현재 사용하고 있는 박스를 나타낸다. Change to: 의 5개의 버튼을 통해 어떤 박스의 카드를 볼 것인지 결정할 수 있다.
[n]은 n번째 박스에 담긴 카드의 개수를 나타낸다.
그 후 Word와 Image와 Answer가 있는데, 단어 카드라면 Word에 있는 것을 보면 되고 (Image 칸의 오류 이미지를 통해 알 수 있다), 이미지 카드라면 이미지를 보고 뜻을 생각하면 된다. 이후 Buttons에 있는 getanswer를 통해 Answer에 띄워지는 정답을 확인할 수 있고, 맞았다면 success를, 틀렸다면 failed를 누르면 된다. success나 failed를 누른 후 next버튼을 누르면 다음 카드를 볼 수 있게 되며, 바뀐 박스의 현황도 업데이트 된다.
5번째 박스에서 success를 누른다면 데이터베이스에서 해당 카드는 삭제된다. (Image는 파일은 남아있지만 더이상 액세스할 수 없다.)
Create WordCard 항목에서는 Word:의 입력칸에 단어를, Answer:의 입력칸에 정답을 입력한 후 그 옆의 create버튼을 누르면 새 단어카드가 1번째 박스에 추가되며, Create ImageCard항목에서는 Image:의 파일 선택에서 이미지를 선택한 후 Answer:의 입력칸에 정답을 입력하고 마찬가지로 그 옆의 create버튼을 누르면 새 이미지카드가 1번째 박스에 추가된다.