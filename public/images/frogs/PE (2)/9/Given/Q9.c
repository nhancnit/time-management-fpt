#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
void listPerfectSquareNumbers(int* list, int n, int* count){
//@STUDENT:ADD YOUR CODE FOR FUNCTION HERE:
  *count = 0;
  for (int i = 1; (long long)i * i < n; i++) {
    list[*count] = i * i;
    (*count)++;
  }

//--FIXED PART - DO NOT EDIT ANY THINGS HERE
}
int main() {
  system("cls");
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  int n = 0;
  scanf("%d", &n);

  int size = (n > 0) ? n : 1;
  int *list = (int *)malloc(size * sizeof(int));
  int count = 0;
  listPerfectSquareNumbers(list, n, &count);

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  if (count == 0) {
    printf("No perfect square numbers less than n");
  } else {
    for (int i = 0; i < count; i++) {
      if (i > 0) {
        printf(" ");
      }
      printf("%d", list[i]);
    }
  }

  free(list);

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
